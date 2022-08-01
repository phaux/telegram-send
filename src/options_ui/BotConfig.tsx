import { useEffect, useState } from "react"
import { download, getFile, getMe, getUserProfilePhotos } from "../common/api"
import { useLoader } from "../common/useLoader"
import { Avatar } from "./Avatar"
import { Input } from "./Input"
import { useDebounce } from "./useDebounce"

interface BotConfigProps {
  botToken: string
  onBotTokenChange: (token: string) => void
}

export function BotConfig(props: BotConfigProps) {
  const { botToken, onBotTokenChange } = props
  const [currentBotToken, setCurrentBotToken] = useState(botToken)
  const [debouncedBotToken] = useDebounce(currentBotToken, 1000)

  const bot = useLoader(async () => {
    if (debouncedBotToken.length === 0) return
    const bot = await getMe(debouncedBotToken)
    return bot
  }, [debouncedBotToken])

  const botPhoto = useLoader(async () => {
    if (bot.value == null) return
    const photos = await getUserProfilePhotos(botToken, bot.value.id)
    if (photos.total_count >= 1) {
      const file = await getFile(botToken, photos.photos[0][0].file_id)
      const blob = await download(botToken, file.file_path)
      return URL.createObjectURL(blob)
    }
  }, [bot.value, botToken])

  useEffect(() => {
    if (bot.value && debouncedBotToken !== botToken) {
      onBotTokenChange(debouncedBotToken)
    }
  }, [bot.value, botToken, debouncedBotToken, onBotTokenChange])

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center">Your Telegram Bot</h1>

      <figure className="flex flex-col items-center gap-2">
        <Avatar className="w-24 h-24">
          {botPhoto.value != null ? (
            <img src={botPhoto.value} alt="Bot icon" />
          ) : (
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z" />
            </svg>
          )}
        </Avatar>

        <figcaption>{bot.value != null ? bot.value.first_name : "Disconnected"}</figcaption>
      </figure>

      {bot.isLoading ? (
        <p className="text-center text-secondary">Connecting to your bot...</p>
      ) : bot.value == null ? (
        <p className="text-center text-secondary">
          Talk to the{" "}
          <a href="https://telegram.me/BotFather" target="_blank" rel="noreferrer">
            BotFather
          </a>{" "}
          to create your bot and obtain their token.
        </p>
      ) : bot.value != null ? (
        <p className="text-center text-secondary">
          Your bot <a href={`https://telegram.me/${bot.value.username}`}>{bot.value.first_name}</a>{" "}
          is connected.
        </p>
      ) : null}

      <Input
        type="text"
        name="bot-token"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="w-full max-w-lg self-center"
        inputClassName="font-mono"
        label="Bot token"
        placeholder="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        value={currentBotToken}
        onChange={(event) => setCurrentBotToken(event.target.value)}
        hint=""
        error={
          bot.error != null
            ? `Authenticating bot failed: ${bot.error.message}. Make sure you're using the correct token.`
            : <>&nbsp;</>
        }
      />
    </div>
  )
}
