import useSWR from "swr"
import { initTgBot } from "tg-bot-client"
import { getSyncStorage, setSyncStorage } from "webext-typed-storage"
import { Avatar } from "../ui/Avatar"
import { IconButton } from "../ui/IconButton"
import { useMutation } from "../utils/useMutation"
import { getTgBotFetcher } from "../utils/getTgBotFetcher"

interface ChatConfigItemProps {
  chatId: string
}

export function ChatConfigItem(props: ChatConfigItemProps) {
  const { chatId } = props

  const botToken = useSWR(["syncStorage", "botToken"] as const, ([, key]) => getSyncStorage(key))
  const chatIds = useSWR(["syncStorage", "chatIds"] as const, ([, key]) => getSyncStorage(key))

  const botUser = useSWR(
    () => botToken.data?.botToken != null && (["tgBot", botToken.data.botToken, "getMe"] as const),
    getTgBotFetcher()
  )
  const chat = useSWR(
    () =>
      botToken.data?.botToken != null &&
      (["tgBot", botToken.data.botToken, "getChat", { chat_id: chatId }] as const),
    getTgBotFetcher()
  )
  const chatMember = useSWR(
    () =>
      botToken.data?.botToken != null &&
      botUser.data?.id != null &&
      ([
        "tgBot",
        botToken.data.botToken,
        "getChatMember",
        { chat_id: chatId, user_id: botUser.data?.id },
      ] as const),
    getTgBotFetcher()
  )
  const chatPhotoFile = useSWR(
    () =>
      botToken.data?.botToken != null &&
      chat.data?.photo?.small_file_id != null &&
      ([
        "tgBot",
        botToken.data.botToken,
        "getFile",
        { file_id: chat.data.photo.small_file_id },
      ] as const),
    getTgBotFetcher()
  )
  const chatPhotoBlob = useSWR(
    () =>
      botToken.data?.botToken != null &&
      chatPhotoFile.data?.file_path != null &&
      (["tgBot", botToken.data?.botToken, "downloadFile", chatPhotoFile.data.file_path] as const),
    getTgBotFetcher()
  )
  const chatPhotoUrl = chatPhotoBlob.data ? URL.createObjectURL(chatPhotoBlob.data) : null
  const botName = botUser.data?.first_name ?? "Your bot"

  const chatIdsMutation = useMutation(chatIds)

  function handleDelete() {
    chatIdsMutation.mutate(async (data) =>
      setSyncStorage({ chatIds: data?.chatIds?.filter((id) => id !== chatId) ?? [] })
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-12">
        {chatPhotoUrl != null ? (
          <img src={chatPhotoUrl} alt="Chat photo" />
        ) : (
          <svg className="w-9 h-9" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )}
      </Avatar>

      <div className="flex-1">
        {renderTitle()}
        {renderStatus()}
      </div>

      <IconButton className="w-12" onClick={handleDelete} disabled={chatIdsMutation.isMutating}>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </IconButton>
    </div>
  )

  function renderTitle() {
    const chatTitle = chat.data?.title ?? chat.data?.first_name ?? chatId
    return (
      <p>
        <b>{chatTitle}</b> {chat.data?.username != null && `(@${chat.data.username})`}
      </p>
    )
  }

  function renderStatus() {
    if (chat.error != null) {
      return (
        <p className="text-sm text-error">
          Loading chat failed:{" "}
          {chat.error instanceof Error ? chat.error.message : String(chat.error)}
        </p>
      )
    }
    if (chatMember.error != null) {
      return (
        <p className="text-sm text-error">
          Loading chat member failed:{" "}
          {chatMember.error instanceof Error ? chatMember.error.message : String(chatMember.error)}
        </p>
      )
    }
    if (!chat.data || !chatMember.data) {
      return <p className="text-sm text-secondary">Connecting...</p>
    }
    if (chatMember.data.status === "left" || chatMember.data.status === "kicked") {
      return (
        <p className="text-sm text-error">
          {botName} is not a member of this {chat.data.type}
        </p>
      )
    }
    if (chatMember.data.status === "member" && chat.data.permissions?.can_send_messages === false) {
      return (
        <p className="text-sm text-error">
          Members can&apos;t send messages in this {chat.data.type}
        </p>
      )
    }
    if (
      chatMember.data.status === "member" &&
      chat.data.permissions?.can_send_media_messages === false
    ) {
      return (
        <p className="text-sm text-error">
          Members can&apos;t send media messages in this {chat.data.type}
        </p>
      )
    }
    if (
      chatMember.data.status === "member" &&
      chat.data.permissions?.can_send_other_messages === false
    ) {
      return (
        <p className="text-sm text-error">Members can&apos;t send GIFs in this {chat.data.type}</p>
      )
    }
    if (chatMember.data.status === "restricted" && chatMember.data.can_send_messages === false) {
      return (
        <p className="text-sm text-error">
          {botName} is restricted from sending messages in this {chat.data.type}
        </p>
      )
    }
    if (
      chatMember.data.status === "restricted" &&
      chatMember.data.can_send_media_messages === false
    ) {
      return (
        <p className="text-sm text-error">
          {botName} is restricted from sending media messages in this {chat.data.type}
        </p>
      )
    }
    if (
      chatMember.data.status === "restricted" &&
      chatMember.data.can_send_other_messages === false
    ) {
      return (
        <p className="text-sm text-error">
          {botName} is restricted from sending GIFs in this {chat.data.type}
        </p>
      )
    }
    if (chatMember.data.status === "administrator" && chatMember.data.can_post_messages === false) {
      return (
        <p className="text-sm text-error">
          {botName} can&apos;t post messages in this {chat.data.type}
        </p>
      )
    }
    return <p className="text-sm text-secondary">Connected to {chat.data.type}</p>
  }
}
