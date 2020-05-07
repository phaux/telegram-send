import genericChatPhoto from "data-url:./chat.svg"
import * as React from "react"
import { download, getChat, getChatMember, getFile, TgBotUser } from "../common/api"
import { Avatar } from "../common/ui/Avatar"
import { Box } from "../common/ui/Box"
import { Button } from "../common/ui/Button"
import { Txt } from "../common/ui/Txt"
import { useLoader } from "../common/ui/useLoader"

interface ChatConfigItemProps {
  botToken: string
  bot: TgBotUser | undefined
  chatId: string
  onRemove: () => void
  onConnected: () => void
}

export function ChatConfigItem(props: ChatConfigItemProps) {
  const chat = useLoader(async () => {
    await new Promise((cb) => setTimeout(cb, 1000))
    return await getChat(props.botToken, props.chatId)
  }, [props.botToken, props.chatId])

  React.useEffect(() => {
    if (chat.value != null) props.onConnected()
  }, [chat.value])

  const chatPhoto = useLoader(async () => {
    if (chat.value == null) return
    if (chat.value.photo == null) return
    const file = await getFile(props.botToken, chat.value.photo.small_file_id)
    const blob = await download(props.botToken, file.file_path)
    return URL.createObjectURL(blob)
  }, [props.botToken, props.chatId, chat.value])

  const chatMember = useLoader(async () => {
    if (props.bot == null) return
    return await getChatMember(props.botToken, props.chatId, props.bot.id)
  }, [props.bot, props.botToken, props.chatId])
  if (chatMember.value) console.log(JSON.stringify([chat.value?.title, chatMember.value?.status]))

  const botName = props.bot?.first_name ?? "Your bot"

  return (
    <Box direction="row" spacing={2}>
      <Avatar size={6} src={chatPhoto.value ?? genericChatPhoto} alt="Chat photo" />

      <Box flex={1}>
        <Txt>
          <b>{chat.value?.title ?? chat.value?.first_name ?? props.chatId}</b>{" "}
          {chat.value?.username && `(@${chat.value.username})`}
        </Txt>
        {chat.error ? (
          <Txt variant="caption" color="error">
            Connecting failed: {chat.error.message}
          </Txt>
        ) : !chat.value ? (
          <Txt variant="caption" color="alt">
            Connecting...
          </Txt>
        ) : chatMember.value?.status === "left" || chatMember.value?.status === "kicked" ? (
          <Txt variant="caption" color="error">
            {botName} is not a member of this {chat.value.type}
          </Txt>
        ) : chat.value.permissions?.can_send_media_messages === false ? (
          <Txt variant="caption" color="error">
            Members can't send media messages in this {chat.value.type}
          </Txt>
        ) : chatMember.value?.can_send_media_messages === false ? (
          <Txt variant="caption" color="error">
            {botName} can't send media messages in this {chat.value.type}
          </Txt>
        ) : chatMember.value?.can_post_messages === false ? (
          <Txt variant="caption" color="error">
            {botName} can't post messages in this {chat.value.type}
          </Txt>
        ) : (
          <Txt variant="caption">Connected to {chat.value.type}</Txt>
        )}
      </Box>

      <Button onClick={props.onRemove}>Delete</Button>
    </Box>
  )
}
