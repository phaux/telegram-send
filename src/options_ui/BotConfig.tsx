import genericBotPhoto from "data-url:./bot.svg"
import * as React from "react"
import { download, getFile, getMe, getUserProfilePhotos } from "../common/api"
import { Avatar } from "../common/ui/Avatar"
import { Box } from "../common/ui/Box"
import { Input } from "../common/ui/Input"
import { Link } from "../common/ui/Link"
import { Txt } from "../common/ui/Txt"
import { useDebounce } from "../common/ui/useDebounce"
import { useLoader } from "../common/ui/useLoader"

interface BotConfigProps {
  botToken: string
  onBotTokenChange: (token: string) => void
}

export function BotConfig(props: BotConfigProps) {
  // state of the bot token input field
  const [botToken, setBotToken] = React.useState(props.botToken)
  const [debouncedBotToken, setDebouncedBotToken] = useDebounce(botToken, 500)

  // update local state when saved value change
  React.useEffect(() => {
    setBotToken(props.botToken)
    setDebouncedBotToken(props.botToken)
  }, [props.botToken])

  // allow clearing saved value when the field is erased
  React.useEffect(() => {
    if (debouncedBotToken === "") props.onBotTokenChange("")
  }, [debouncedBotToken])

  // bot data from telegram API
  const bot = useLoader(async () => {
    if (botToken !== debouncedBotToken) return
    if (!BOT_TOKEN_PATTERN.exec(botToken)) return
    // await new Promise((cb) => setTimeout(cb, 1000))
    const bot = await getMe(botToken)
    return bot
  }, [botToken, debouncedBotToken])

  // save token as soon as we get valid bot data
  React.useEffect(() => {
    if (bot.value != null) {
      props.onBotTokenChange(debouncedBotToken)
    }
  }, [bot.value])

  // bot photo from telegram API
  const botPhoto = useLoader(async () => {
    if (botToken !== debouncedBotToken) return
    if (bot.value == null) return
    const photos = await getUserProfilePhotos(botToken, bot.value.id)
    if (photos.total_count >= 1) {
      const file = await getFile(botToken, photos.photos[0][0].file_id)
      const blob = await download(botToken, file.file_path)
      return URL.createObjectURL(blob)
    }
  }, [bot.value, botToken, debouncedBotToken])

  return (
    <Box spacing={2} my={2}>
      <Txt component="h1" variant="header" align="center">
        Your Telegram Bot
      </Txt>

      <Box component="figure" align="center">
        <Box m={1}>
          <Avatar
            size={10}
            src={botPhoto.value != null ? botPhoto.value : genericBotPhoto}
            alt="Bot icon"
          />
        </Box>
        <Txt component="figcaption" align="center">
          {bot.value != null ? `Hello, ${bot.value.first_name}!` : "Not connected."}
        </Txt>
      </Box>

      <Box my={2}>
        {bot.isLoading || debouncedBotToken !== botToken ? (
          <Txt color="alt" align="center">
            Connecting your bot...
          </Txt>
        ) : bot.value == null ? (
          <Txt color="alt" align="center">
            Talk to <Link href="https://telegram.me/BotFather">BotFather</Link> to create your bot
            and obtain it's token.
          </Txt>
        ) : bot.value != null ? (
          <Txt color="alt" align="center">
            Your bot{" "}
            <Link href={`https://telegram.me/${bot.value.username}`}>{bot.value.first_name}</Link>{" "}
            is connected.
          </Txt>
        ) : null}
      </Box>

      <Box align="center">
        <Input
          style={{ width: 400 }}
          label="Bot token"
          value={botToken}
          onChange={setBotToken}
          selectOnFocus
          error={
            !BOT_TOKEN_PATTERN.exec(botToken) && botToken.length > 0
              ? "Invalid bot token"
              : bot.error != null
              ? `Login failed: ${bot.error.message}. Make sure you're using the correct token.`
              : undefined
          }
          help={""}
        />
      </Box>
    </Box>
  )
}

const BOT_TOKEN_PATTERN = /^\d+:[\w-]+$/
