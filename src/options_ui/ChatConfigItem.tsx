import { download, getChat, getChatMember, getFile, getMe } from "../common/api"
import { Avatar } from "../common/ui/Avatar"
import { Box } from "../common/ui/Box"
import { Button } from "../common/ui/Button"
import { Txt } from "../common/ui/Txt"
import { useLoader } from "../common/useLoader"
import genericChatPhoto from "./chat.svg"

// const genericChatPhoto = new URL("./chat.svg", import.meta.url).href;

interface ChatConfigItemProps {
  botToken: string
  chatId: string
  onRemove: () => void
}

export function ChatConfigItem(props: ChatConfigItemProps) {
  const { botToken, chatId, onRemove } = props

  const bot = useLoader(async () => {
    if (!botToken) return
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
    <Box direction="row" spacing={2}>
      <Avatar size={6} src={chatPhoto.value ?? genericChatPhoto} alt="Chat photo" />

      <Box flex={1}>
        {renderTitle()}
        {renderStatus()}
      </Box>

      <Button onClick={onRemove}>Delete</Button>
    </Box>
  )

  function renderTitle() {
    const chatTitle = chat.value?.title ?? chat.value?.first_name ?? chatId
    return (
      <Txt>
        <b>{chatTitle}</b> {chat.value?.username != null && `(@${chat.value.username})`}
      </Txt>
    )
  }

  function renderStatus() {
    if (chat.error) {
      return (
        <Txt variant="caption" color="error">
          Connecting failed: {chat.error.message}
        </Txt>
      )
    }
    if (!chat.value) {
      return (
        <Txt variant="caption" color="alt">
          Connecting...
        </Txt>
      )
    }
    if (chatMember.value?.status === "left" || chatMember.value?.status === "kicked") {
      return (
        <Txt variant="caption" color="error">
          {botName} is not a member of this {chat.value.type}
        </Txt>
      )
    }
    if (chat.value.permissions?.can_send_media_messages === false) {
      return (
        <Txt variant="caption" color="error">
          Members can&apos;t send media messages in this {chat.value.type}
        </Txt>
      )
    }
    if (chatMember.value?.can_send_media_messages === false) {
      return (
        <Txt variant="caption" color="error">
          {botName} can&apos;t send media messages in this {chat.value.type}
        </Txt>
      )
    }
    if (chatMember.value?.can_post_messages === false) {
      return (
        <Txt variant="caption" color="error">
          {botName} can&apos;t post messages in this {chat.value.type}
        </Txt>
      )
    }
    return <Txt variant="caption">Connected to {chat.value.type}</Txt>
  }
}
