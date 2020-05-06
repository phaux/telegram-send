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
        Default icons made by{" "}
        <Link href="https://www.flaticon.com/authors/freepik" title="Freepik">
          Freepik
        </Link>{" "}
        from{" "}
        <Link href="https://www.flaticon.com/" title="Flaticon">
          flaticon.com
        </Link>
      </Txt>
    </>
  )
}
