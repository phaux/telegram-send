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
  return await browser.tabs.sendMessage(tabId, { type, data })
}
