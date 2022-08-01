import { useAppStorage } from "../common/useAppStorage"
import { BotConfig } from "./BotConfig"
import { ChatConfig } from "./ChatConfig"

export function Config() {
  const [storage, setStorage] = useAppStorage()

  return (
    <div className="mx-auto p-4 w-full max-w-screen-sm flex flex-col items-stretch gap-12">
      {!storage.isLoading && (
        <BotConfig
          botToken={storage.botToken}
          onBotTokenChange={(botToken) => void setStorage({ botToken })}
        />
      )}

      {!storage.isLoading && storage.botToken && (
        <ChatConfig
          botToken={storage.botToken}
          chatIds={storage.chatIds}
          onChatIdsChange={(chatIds) => void setStorage({ chatIds })}
        />
      )}

      <p className="text-secondary text-center text-sm">
        Join <a href="https://telegram.me/tgsend">Telegram Send</a> group if you have any questions
        or feature requests!
      </p>
    </div>
  )
}
