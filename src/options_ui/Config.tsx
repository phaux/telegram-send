import * as React from "react"
import { Link } from "../common/ui/Link"
import { Txt } from "../common/ui/Txt"
import { useAppStorage } from "../common/ui/useAppStorage"
import { BotConfig } from "./BotConfig"
import { ChatConfig } from "./ChatConfig"

export function Config() {
  const [storage, setStorage] = useAppStorage()

  return (
    <>
      {!storage.isLoading && (
        <BotConfig
          botToken={storage.botToken}
          onBotTokenChange={(botToken) => {
            setStorage({ botToken })
          }}
        />
      )}

      {!storage.isLoading && storage.botToken && (
        <ChatConfig
          botToken={storage.botToken}
          chatIds={storage.chatIds}
          onChatIdsChange={(chatIds) => {
            setStorage({ chatIds })
          }}
        />
      )}

      <Txt mt={4} mb={2} variant="caption" color="alt" align="center">
        Join <Link href="https://telegram.me/tgsend">Telegram Send</Link> group if you have any
        questions or feature requests!
      </Txt>
      <Txt my={2} variant="caption" color="alt" align="center">
        Default icons made by <Link href="https://www.flaticon.com/authors/freepik">Freepik</Link>{" "}
        from <Link href="https://www.flaticon.com/">flaticon.com</Link>.
      </Txt>
    </>
  )
}
