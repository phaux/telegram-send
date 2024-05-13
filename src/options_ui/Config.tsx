import useSWR from "swr"
import { callTgApi } from "tinygram"
import { getSyncStorage } from "webext-typed-storage"
import { BotConfig } from "./BotConfig"
import { ChatConfig } from "./ChatConfig"

export function Config() {
  const botToken = useSWR(["syncStorage", "botToken"] as const, ([, key]) => getSyncStorage(key))
  const botUser = useSWR(
    () => botToken.data?.botToken != null && (["tgBot", botToken.data.botToken, "getMe"] as const),
    ([, botToken, method]) => callTgApi({ botToken }, method, undefined),
  )

  return (
    <div className="mx-auto p-4 w-full max-w-screen-sm flex flex-col items-stretch gap-12">
      <BotConfig />

      {botUser.data != null && <ChatConfig />}

      <p className="text-secondary text-center text-sm">
        Join <a href="https://telegram.me/tgsend">Telegram Send</a> group if you have any questions
        or feature requests!
      </p>
    </div>
  )
}
