import { FormEvent, useState } from "react"
import useSWR from "swr"
import { callTgApi, getTgFileData } from "tinygram"
import { getSyncStorage, setSyncStorage } from "webext-typed-storage"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useDebounce } from "../utils/useDebounce"
import { useMutation } from "../utils/useMutation"
import { ChatConfigItem } from "./ChatConfigItem"

declare module "webext-typed-storage" {
  export interface SyncStorage {
    chatIds: string[]
  }
}

export function ChatConfig() {
  const [newChatId, setNewChatId] = useState("")
  const [debouncedChatId, setDebouncedChatId] = useDebounce(newChatId, 1000)

  const botToken = useSWR(["syncStorage", "botToken"] as const, ([, key]) => getSyncStorage(key))
  const chatIds = useSWR(["syncStorage", "chatIds"] as const, async ([, key]) =>
    getSyncStorage(key),
  )

  const botUser = useSWR(
    () => botToken.data?.botToken != null && (["tgBot", botToken.data.botToken, "getMe"] as const),
    ([, botToken, method]) => callTgApi({ botToken }, method, undefined),
  )
  const chat = useSWR(
    () =>
      botToken.data?.botToken != null &&
      debouncedChatId.length > 0 &&
      (["tgBot", botToken.data.botToken, "getChat", { chat_id: debouncedChatId }] as const),
    ([, botToken, method, params]) => callTgApi({ botToken }, method, params),
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
    ([, botToken, method, params]) => callTgApi({ botToken }, method, params),
  )
  const chatPhotoBlob = useSWR(
    () =>
      botToken.data?.botToken != null &&
      chatPhotoFile.data?.file_path != null &&
      (["tgBotFile", botToken.data.botToken, chatPhotoFile.data.file_path] as const),
    ([, botToken, path]) => getTgFileData({ botToken }, path),
  )
  const chatPhotoUrl = chatPhotoBlob.data ? URL.createObjectURL(chatPhotoBlob.data) : null

  const chatIdsMutation = useMutation(chatIds)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    chatIdsMutation.mutate((data) => {
      const newChatIds = new Set(data?.chatIds)
      newChatIds.add(newChatId)
      return setSyncStorage({ chatIds: Array.from(newChatIds) })
    })
    setNewChatId("")
    setDebouncedChatId("")
  }

  return (
    <div className="flex flex-col gap-8">
      <h1>Your Telegram Chats</h1>

      <p>
        For public groups and channels, use their <code>@public_name</code>. Alternatively, you can
        use the internal number ID of the chat. You can send an invite link to the{" "}
        <a href="https://telegram.me/username_to_id_bot">ID Bot</a> to obtain it.
      </p>

      <form className="flex items-center gap-6" onSubmit={handleSubmit}>
        <Avatar className="w-16 h-16">
          {chatPhotoUrl != null ? (
            <img src={chatPhotoUrl} alt="Bot icon" />
          ) : (
            <svg className="w-12 h-12" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          )}
        </Avatar>

        <Input
          type="text"
          label="Chat ID"
          name="chat-id"
          className="w-16 flex-grow"
          value={newChatId}
          onChange={(event) => {
            setNewChatId(event.target.value)
          }}
          hint={
            chat.isLoading ? (
              <span>Loading...</span>
            ) : chat.data != null ? (
              <span>
                Welcome to {chat.data.title ?? chat.data.first_name ?? chat.data.username ?? ""}{" "}
                {chat.data.type}!
              </span>
            ) : (
              <>&nbsp;</>
            )
          }
          error={
            chat.error != null ? (
              <span>
                Can&apos;t load chat:{" "}
                {chat.error instanceof Error ? chat.error.message : String(chat.error)}. Try
                inviting {botUser.data?.first_name ?? "your bot"} first.
              </span>
            ) : undefined
          }
          required
        />

        <Button type="submit" disabled={chatIdsMutation.isMutating}>
          Add
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        {chatIds.data?.chatIds?.map((chatId) => <ChatConfigItem key={chatId} chatId={chatId} />)}
      </div>

      {(chatIds.data?.chatIds?.length ?? 0) > 0 && (
        <p>You can now share media from web pages by selecting your chat from the context menu!</p>
      )}
    </div>
  )
}
