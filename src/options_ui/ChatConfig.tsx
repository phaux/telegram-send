import * as React from "react"
import { download, getChat, getFile, getMe } from "../common/api"
import { Avatar } from "../common/ui/Avatar"
import { Box } from "../common/ui/Box"
import { Button } from "../common/ui/Button"
import { Input } from "../common/ui/Input"
import { Link } from "../common/ui/Link"
import { Txt } from "../common/ui/Txt"
import { useDebounce } from "../common/ui/useDebounce"
import { useLoader } from "../common/ui/useLoader"
import { useList } from "../common/useList"
import { ChatConfigItem } from "./ChatConfigItem"

const genericChatPhoto = new URL("./chat.svg", import.meta.url).href

interface ChatConfigProps {
  botToken: string
  chatIds: string[]
  onChatIdsChange: (chats: string[]) => void
}

export function ChatConfig(props: ChatConfigProps) {
  const [newChatId, setNewChatId] = React.useState("")
  const [debouncedChatId, setDebouncedChatId] = useDebounce(newChatId, 1000)
  const [chatIds, chatIdsDispatch] = useList(props.chatIds)

  React.useEffect(() => {
    props.onChatIdsChange(chatIds)
  }, [chatIds])

  const chat = useLoader(async () => {
    if (debouncedChatId !== newChatId) return
    if (!CHAT_ID_PATTERN.exec(newChatId)) return
    const chat = await getChat(props.botToken, newChatId)
    return chat
  }, [props.botToken, newChatId, debouncedChatId])

  const chatPhoto = useLoader(async () => {
    if (debouncedChatId !== newChatId) return
    if (chat.value == null) return
    if (chat.value.photo == null) return
    const file = await getFile(props.botToken, chat.value.photo.small_file_id)
    const blob = await download(props.botToken, file.file_path)
    return URL.createObjectURL(blob)
  }, [props.botToken, chat.value, newChatId, debouncedChatId])

  const bot = useLoader(async () => {
    return await getMe(props.botToken)
  }, [props.botToken])

  const [connectedChatIds, connectedChatIdsDispatch] = useList<string>()

  return (
    <Box spacing={2} my={2}>
      <Txt component="h1" variant="header" my={1}>
        Your Telegram Chats
      </Txt>

      <Txt>
        For public groups and channels, use their <code>@public_name</code>. Alternatively, you can
        use the internal number ID of the chat. You can send an invite link to the{" "}
        <Link href="https://telegram.me/username_to_id_bot">ID Bot</Link> to obtain it.
      </Txt>

      <Box
        component="form"
        direction="row"
        align="center"
        spacing={2}
        onSubmit={(ev) => {
          ev.preventDefault()

          chatIdsDispatch({ type: "add", item: newChatId })
          setNewChatId("")
          setDebouncedChatId("")
        }}
      >
        <Avatar size={8} src={chatPhoto.value ?? genericChatPhoto} alt="Chat photo" />
        <Box flex={1}>
          <Input
            label="Chat ID"
            value={newChatId}
            onChange={setNewChatId}
            help={
              chat.isLoading
                ? "Loading..."
                : chat.value
                ? `Welcome to ${
                    chat.value.title ?? chat.value.first_name ?? chat.value.username ?? ""
                  } ${chat.value.type}!`
                : ""
            }
            error={
              newChatId !== "" && !CHAT_ID_PATTERN.exec(newChatId)
                ? "Invalid chat ID"
                : chat.error
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
            botToken={props.botToken}
            bot={bot.value}
            chatId={chatId}
            onRemove={() => chatIdsDispatch({ type: "remove", item: chatId })}
            onConnected={() => connectedChatIdsDispatch({ type: "add", item: chatId })}
          />
        ))}
      </Box>

      {chatIds.some((chatId) => connectedChatIds.includes(chatId)) && (
        <Txt my={2}>
          You can now share media from web pages by selecting your chat from the context menu!
        </Txt>
      )}
    </Box>
  )
}

const CHAT_ID_PATTERN = /^(-?\d{8,}|@\w{5,})$/
