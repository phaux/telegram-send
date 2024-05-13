import { FormEvent, useState } from "react"
import useSWR from "swr"
import { callTgApi, getTgFileData } from "tinygram"
import { getSyncStorage, setSyncStorage } from "webext-typed-storage"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useMutation } from "../utils/useMutation"

declare module "webext-typed-storage" {
  export interface SyncStorage {
    botToken: string
  }
}

export function BotConfig() {
  const [currentToken, setCurrentToken] = useState<string>()

  const botToken = useSWR(["syncStorage", "botToken"] as const, ([, key]) => getSyncStorage(key))

  const botUser = useSWR(
    () => botToken.data?.botToken != null && (["tgBot", botToken.data.botToken, "getMe"] as const),
    ([, botToken, method]) => callTgApi({ botToken }, method, undefined),
  )
  const botPhotos = useSWR(
    () =>
      botToken.data?.botToken != null &&
      botUser.data?.id != null &&
      ([
        "tgBot",
        botToken.data.botToken,
        "getUserProfilePhotos",
        { user_id: botUser.data.id },
      ] as const),
    ([, botToken, method, params]) => callTgApi({ botToken }, method, params),
  )
  const botPhotoFile = useSWR(
    () =>
      botToken.data?.botToken != null &&
      botPhotos.data?.photos[0] != null &&
      ([
        "tgBot",
        botToken.data.botToken,
        "getFile",
        { file_id: botPhotos.data.photos[0][0].file_id },
      ] as const),
    ([, botToken, method, params]) => callTgApi({ botToken }, method, params),
  )
  const botPhotoBlob = useSWR(
    () =>
      botToken.data?.botToken != null &&
      botPhotoFile.data?.file_path != null &&
      (["tgBotFile", botToken.data.botToken, botPhotoFile.data.file_path] as const),
    ([, botToken, path]) => getTgFileData({ botToken }, path),
  )

  const photoUrl = botPhotoBlob.data ? URL.createObjectURL(botPhotoBlob.data) : null

  const botTokenMutation = useMutation(botToken)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (currentToken == null) return
    const newToken = currentToken
    botTokenMutation.mutate(async () => {
      await callTgApi({ botToken: newToken }, "getMe", undefined)
      return await setSyncStorage({ botToken: newToken })
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center">Your Telegram Bot</h1>

      <figure className="flex flex-col items-center gap-2">
        <Avatar className="w-24 h-24">
          {photoUrl != null ? (
            <img src={photoUrl} alt="Bot icon" />
          ) : (
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z" />
            </svg>
          )}
        </Avatar>

        <figcaption>{botUser.data != null ? botUser.data.first_name : "Disconnected"}</figcaption>
      </figure>

      {botUser.isValidating ? (
        <p className="text-center text-secondary">Connecting to your bot...</p>
      ) : botUser.data == null ? (
        <p className="text-center text-secondary">
          Talk to the{" "}
          <a href="https://telegram.me/BotFather" target="_blank" rel="noreferrer">
            BotFather
          </a>{" "}
          to create your bot and obtain its token.
        </p>
      ) : (
        <p className="text-center text-secondary">
          Your bot{" "}
          {botUser.data.username != null ? (
            <a href={`https://telegram.me/${botUser.data.username}`}>{botUser.data.first_name}</a>
          ) : (
            <span>{botUser.data.first_name}</span>
          )}{" "}
          is connected.
        </p>
      )}

      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <Input
          required
          className="flex-1"
          type="text"
          name="bot-token"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          disabled={botToken.isLoading}
          inputClassName="font-mono"
          label="Bot token"
          placeholder="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          value={currentToken ?? botToken.data?.botToken ?? ""}
          onChange={(event) => {
            setCurrentToken(event.target.value)
          }}
          hint={botTokenMutation.isMutating ? <span>Logging in...</span> : <span>&nbsp;</span>}
          error={
            botTokenMutation.error != null ? (
              <span>Authentication error: {botTokenMutation.error.message}</span>
            ) : null
          }
        />
        <Button type="submit" disabled={botTokenMutation.isMutating}>
          Login
        </Button>
      </form>
    </div>
  )
}
