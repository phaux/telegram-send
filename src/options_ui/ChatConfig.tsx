import { FormEvent, useState } from "react"
import { initTgBot } from "tg-bot-client"
import { useLoader } from "../common/useLoader"
import { Avatar } from "./Avatar"
import { Button } from "./Button"
import { ChatConfigItem } from "./ChatConfigItem"
import { Input } from "./Input"
import { useDebounce } from "./useDebounce"

interface ChatConfigProps {
  botToken: string
  chatIds: string[]
  onChatIdsChange: (chats: string[]) => void
}

export function ChatConfig(props: ChatConfigProps) {
  const { botToken, chatIds, onChatIdsChange } = props
  const [newChatId, setNewChatId] = useState("")
  const [debouncedChatId, setDebouncedChatId] = useDebounce(newChatId, 1000)

  const botUser = useLoader(async () => {
    if (botToken.length === 0) return
    const botUser = await initTgBot({ token: botToken }).getMe()
    return botUser
  }, [botToken])

  const chat = useLoader(async () => {
    if (debouncedChatId.length === 0) return
    const chat = await initTgBot({ token: botToken }).getChat({ chat_id: debouncedChatId })
    return chat
  }, [botToken, debouncedChatId])

  const chatPhoto = useLoader(async () => {
    if (chat.value == null) return
    if (chat.value.photo == null) return
    const file = await initTgBot({ token: botToken }).getFile({
      file_id: chat.value.photo.small_file_id,
    })
    if (file.file_path == null) return
    const blob = await initTgBot({ token: botToken }).downloadFile(file.file_path)
    return URL.createObjectURL(blob)
  }, [botToken, chat.value, debouncedChatId])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!chatIds.includes(newChatId)) {
      void onChatIdsChange([...chatIds, newChatId])
    }
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
          {chatPhoto.value != null ? (
            <img src={chatPhoto.value} alt="Bot icon" />
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
          onChange={(event) => setNewChatId(event.target.value)}
          hint={
            chat.isLoading ? (
              "Loading..."
            ) : chat.value != null ? (
              `Welcome to ${
                chat.value.title ?? chat.value.first_name ?? chat.value.username ?? ""
              } ${chat.value.type}!`
            ) : (
              <>&nbsp;</>
            )
          }
          error={
            chat.error != null
              ? `Connecting failed: ${chat.error.message}. Try inviting ${
                  botUser.value?.first_name ?? "your bot"
                } first.`
              : undefined
          }
          required
        />

        <Button type="submit">Add</Button>
      </form>

      <div className="flex flex-col gap-4">
        {chatIds.map((chatId) => (
          <ChatConfigItem
            key={chatId}
            botToken={botToken}
            chatId={chatId}
            onRemove={() => onChatIdsChange(chatIds.filter((id) => id !== chatId))}
          />
        ))}
      </div>

      {chatIds.length > 0 && (
        <p>You can now share media from web pages by selecting your chat from the context menu!</p>
      )}
    </div>
  )
}
