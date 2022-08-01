import { runtime, tabs } from "webextension-polyfill"
import type { TgSendMediaGroupData, TgSendPhotoData } from "./api"

export type AppMessageMap = {
  getPhoto: {
    req: {
      elemId: number
    }
    res: Omit<TgSendPhotoData, "chat_id">
  }
  getSelection: {
    req: void
    res: Omit<TgSendMediaGroupData, "chat_id">
  }
}

export async function sendTabMessage<T extends keyof AppMessageMap>(
  tabId: number,
  type: T,
  data: AppMessageMap[T]["req"]
): Promise<AppMessageMap[T]["res"] | void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await tabs.sendMessage(tabId, { type, data })
}

export function registerMessageHandler(messageListeners: {
  [P in keyof AppMessageMap]: (req: AppMessageMap[P]["req"]) => AppMessageMap[P]["res"] | void
}) {
  runtime.onMessage.addListener((msg) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return Promise.resolve(messageListeners[msg.type as keyof AppMessageMap](msg.data))
  })
}
