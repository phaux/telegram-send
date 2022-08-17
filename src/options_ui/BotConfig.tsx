import { useEffect, useState } from "react"
import { initTgBot } from "tg-bot-client"
import { useLoader } from "../common/useLoader"
import { Avatar } from "./Avatar"
import { Input } from "./Input"
import { useDebounce } from "./useDebounce"

interface BotConfigProps {
  botToken: string
  onBotTokenChange: (botToken: string) => void
}

export function BotConfig(props: BotConfigProps) {
  const { botToken, onBotTokenChange } = props
  const [currentBotToken, setCurrentBotToken] = useState(botToken)
  const [debouncedBotToken] = useDebounce(currentBotToken, 1000)

  const botUser = useLoader(async () => {
    if (debouncedBotToken.length === 0) return
    const botUser = await initTgBot({ token: debouncedBotToken }).getMe()
    return botUser
  }, [debouncedBotToken])

  const botPhoto = useLoader(async () => {
    const tgBot = initTgBot({ token: botToken })
    if (botUser.value == null) return
    const photos = await tgBot.getUserProfilePhotos({ user_id: botUser.value.id })
    if (photos.total_count >= 1) {
      const file = await tgBot.getFile({ file_id: photos.photos[0][0].file_id })
      if (file.file_path != null) {
        const blob = await tgBot.downloadFile(file.file_path)
        return URL.createObjectURL(blob)
      }
    }
  }, [botUser.value, botToken])

  useEffect(() => {
    if (botUser.value && debouncedBotToken !== botToken) {
      onBotTokenChange(debouncedBotToken)
    }
  }, [botUser.value, botToken, debouncedBotToken, onBotTokenChange])

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

        <figcaption>{botUser.value != null ? botUser.value.first_name : "Disconnected"}</figcaption>
      </figure>

      {botUser.isLoading ? (
        <p className="text-center text-secondary">Connecting to your bot...</p>
      ) : botUser.value == null ? (
        <p className="text-center text-secondary">
          Talk to the{" "}
          <a href="https://telegram.me/BotFather" target="_blank" rel="noreferrer">
            BotFather
          </a>{" "}
          to create your bot and obtain their token.
        </p>
      ) : botUser.value != null ? (
        <p className="text-center text-secondary">
          Your bot{" "}
          {botUser.value.username != null ? (
            <a href={`https://telegram.me/${botUser.value.username}`}>{botUser.value.first_name}</a>
          ) : (
            <span>{botUser.value.first_name}</span>
          )}{" "}
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
          botUser.error != null ? (
            `Authenticating bot failed: ${botUser.error.message}. Make sure you're using the correct token.`
          ) : (
            <>&nbsp;</>
          )
        }
      />
    </div>
  )
}
