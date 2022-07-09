import { useState } from "react"
import { download, getChat, getFile, getMe } from "../common/api"
import { Avatar } from "../common/ui/Avatar"
import { Box } from "../common/ui/Box"
import { Button } from "../common/ui/Button"
import { Input } from "../common/ui/Input"
import { Link } from "../common/ui/Link"
import { Txt } from "../common/ui/Txt"
import { useLoader } from "../common/useLoader"
import genericChatPhoto from "./chat.svg"
import { ChatConfigItem } from "./ChatConfigItem"

// const genericChatPhoto = new URL("./chat.svg", import.meta.url).href;

interface ChatConfigProps {
  botToken: string
  chatIds: string[]
  onChatIdsChange: (chats: string[]) => void
}

export function ChatConfig(props: ChatConfigProps) {
  const { botToken, chatIds, onChatIdsChange } = props
  const [newChatId, setNewChatId] = useState("")

  const bot = useLoader(async () => {
    if (!botToken) return
    const bot = await getMe(botToken)
    return bot
  }, [botToken])

  const chat = useLoader(async () => {
    if (!newChatId) return
    const chat = await getChat(botToken, newChatId)
    return chat
  }, [botToken, newChatId])

  const chatPhoto = useLoader(async () => {
    if (chat.value == null) return
    if (chat.value.photo == null) return
    const file = await getFile(botToken, chat.value.photo.small_file_id)
    const blob = await download(botToken, file.file_path)
    return URL.createObjectURL(blob)
  }, [botToken, chat.value, newChatId])

  function handleSubmit(event: Event) {
    event.preventDefault()
    if (!chatIds.includes(newChatId)) {
      void onChatIdsChange([...chatIds, newChatId])
    }
    setNewChatId("")
  }

  return (
    <Box spacing={2} my={2}>
      <form onSubmit={(e) => e} />

      <Txt component="h1" variant="header" my={1}>
        Your Telegram Chats
      </Txt>

      <Txt>
        For public groups and channels, use their <code>@public_name</code>. Alternatively, you can
        use the internal number ID of the chat. You can send an invite link to the{" "}
        <Link href="https://telegram.me/username_to_id_bot">ID Bot</Link> to obtain it.
      </Txt>

      <Box component="form" direction="row" align="center" spacing={2} onSubmit={handleSubmit}>
        <Avatar size={8} src={chatPhoto.value ?? genericChatPhoto} alt="Chat photo" />
        <Box flex={1}>
          <Input
            label="Chat ID"
            value={newChatId}
            onChange={setNewChatId}
            help={
              chat.isLoading
                ? "Loading..."
                : chat.value != null
                ? `Welcome to ${
                    chat.value.title ?? chat.value.first_name ?? chat.value.username ?? ""
                  } ${chat.value.type}!`
                : ""
            }
            error={
              chat.error != null
                ? `Connecting failed: ${chat.error.message}. Try inviting ${
                    bot.value?.first_name ?? "your bot"
                  } first.`
                : undefined
            }
            inputProps={{ required: true }}
          />
        </Box>
        <Button type="submit" color="primary">
          Add
        </Button>
      </Box>

      <Box spacing={2}>
        {chatIds.map((chatId) => (
          <ChatConfigItem
            key={chatId}
            botToken={botToken}
            chatId={chatId}
            onRemove={() => onChatIdsChange(chatIds.filter((id) => id !== chatId))}
          />
        ))}
      </Box>

      {chatIds.length > 0 && (
        <Txt my={2}>
          You can now share media from web pages by selecting your chat from the context menu!
        </Txt>
      )}
    </Box>
  )
}
