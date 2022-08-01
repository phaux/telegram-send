import { download, getChat, getChatMember, getFile, getMe } from "../common/api"
import { useLoader } from "../common/useLoader"
import { Avatar } from "./Avatar"
import { IconButton } from "./IconButton"

interface ChatConfigItemProps {
  botToken: string
  chatId: string
  onRemove: () => void
}

export function ChatConfigItem(props: ChatConfigItemProps) {
  const { botToken, chatId, onRemove } = props

  const bot = useLoader(async () => {
    if (botToken.length === 0) return
    const bot = await getMe(botToken)
    return bot
  }, [botToken])

  const chat = useLoader(async () => {
    await new Promise((cb) => setTimeout(cb, 1000))
    return await getChat(botToken, chatId)
  }, [botToken, chatId])

  const chatPhoto = useLoader(async () => {
    if (chat.value == null) return
    if (chat.value.photo == null) return
    const file = await getFile(botToken, chat.value.photo.small_file_id)
    const blob = await download(botToken, file.file_path)
    return URL.createObjectURL(blob)
  }, [botToken, chatId, chat.value])

  const chatMember = useLoader(async () => {
    if (bot.value == null) return
    return await getChatMember(botToken, chatId, bot.value.id)
  }, [bot.value, botToken, chatId])

  const botName = bot.value?.first_name ?? "Your bot"

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-12">
        {chatPhoto.value != null ? (
          <img src={chatPhoto.value} alt="Chat photo" />
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

      <IconButton className="w-12" onClick={onRemove}>
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
    const chatTitle = chat.value?.title ?? chat.value?.first_name ?? chatId
    return (
      <p>
        <b>{chatTitle}</b> {chat.value?.username != null && `(@${chat.value.username})`}
      </p>
    )
  }

  function renderStatus() {
    if (chat.error) {
      return <p className="text-sm text-error">Connecting failed: {chat.error.message}</p>
    }
    if (!chat.value) {
      return (
        <p className="text-sm text-secondary" color="alt">
          Connecting...
        </p>
      )
    }
    if (chatMember.value?.status === "left" || chatMember.value?.status === "kicked") {
      return (
        <p className="text-sm text-error">
          {botName} is not a member of this {chat.value.type}
        </p>
      )
    }
    if (chat.value.permissions?.can_send_media_messages === false) {
      return (
        <p className="text-sm text-error">
          Members can&apos;t send media messages in this {chat.value.type}
        </p>
      )
    }
    if (chatMember.value?.can_send_media_messages === false) {
      return (
        <p className="text-sm text-error">
          {botName} can&apos;t send media messages in this {chat.value.type}
        </p>
      )
    }
    if (chatMember.value?.can_post_messages === false) {
      return (
        <p className="text-sm text-error">
          {botName} can&apos;t post messages in this {chat.value.type}
        </p>
      )
    }
    return <p className="text-sm text-secondary">Connected to {chat.value.type}</p>
  }
}
