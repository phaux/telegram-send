import type { TgSendMediaGroupData, TgSendPhotoData } from "./api"

type AppMessageMap = {
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

export function registerMessageListener(
  handlers: {
    [P in keyof AppMessageMap]: (req: AppMessageMap[P]["req"]) => AppMessageMap[P]["res"] | void
  }
) {
  const handlerMap = new Map(Object.entries(handlers))
  browser.runtime.onMessage.addListener(async (msg: any) => {
    return handlerMap.get(msg.type)?.(msg.data)
  })
}

export async function sendTabMessage<T extends keyof AppMessageMap>(
  tabId: number,
  type: T,
  data: AppMessageMap[T]["req"]
): Promise<AppMessageMap[T]["res"] | void> {
  return await browser.tabs.sendMessage(tabId, { type, data })
}
