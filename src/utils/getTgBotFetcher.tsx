import { initTgBot, TgBot } from "tg-bot-client"

export function getTgBotFetcher<M extends keyof TgBot>(): (
  args: readonly [
    "tgBot",
    string,
    M,
    ...(TgBot[M] extends (...params: infer P) => unknown ? P : [])
  ]
) => Promise<Awaited<ReturnType<TgBot[M]>>> {
  return (args) => {
    const [, token, method, params] = args
    const tgBot = initTgBot({ token })
    return tgBot[method](params as never) as never
  }
}
