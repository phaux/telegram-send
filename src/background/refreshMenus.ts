import { initTgBot } from "tinygram"
import { sendTabMessage } from "webext-typed-messages"
import { getSyncStorage } from "webext-typed-storage"
import { promisify } from "../utils/promisify"

export async function refreshMenus() {
  const { botToken, chatIds = [] } = await getSyncStorage(["botToken", "chatIds"])
  if (botToken == null) return
  const tgBot = initTgBot({ botToken })

  await promisify(chrome.contextMenus.removeAll)()

  for (const chatId of chatIds) {
    const chat = await tgBot.getChat({ chat_id: chatId })
    const chatName = chat.title ?? chat.first_name ?? String(chat.id)

    chrome.contextMenus.create({
      id: `sendPhoto-${botToken}-${chatId}`,
      contexts: ["image"],
      title: `Send image to ${chatName} ${chat.type}`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- wrapped in try-catch
      onclick: async (info, tab) => {
        if (tab.id == null) return
        try {
          const data = await sendTabMessage(tab.id, "getPhoto")
          if (!data) return
          await tgBot.sendPhoto({ chat_id: chatId, ...data })
        } catch (error) {
          if (error instanceof Error) {
            showError(`Sending photo to ${chatName} ${chat.type} failed: ${error.message}`)
          }
        }
      },
    })

    chrome.contextMenus.create({
      id: `sendSelection-${botToken}-${chatId}`,
      contexts: ["selection"],
      title: `Send selection to ${chatName} ${chat.type}`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- wrapped in try-catch
      onclick: async (info, tab) => {
        if (tab.id == null) return
        try {
          const data = await sendTabMessage(tab.id, "getSelection")
          if (!data) return
          await tgBot.sendMediaGroup({ chat_id: chatId, ...data })
        } catch (error) {
          if (error instanceof Error) {
            showError(`Sending selection to ${chatName} ${chat.type} failed: ${error.message}`)
          }
        }
      },
    })
  }
}

function showError(message: string) {
  chrome.notifications.create({
    type: "basic",
    title: "Telegram Send Error",
    iconUrl: new URL("../images/telegram.png?width=48", import.meta.url).href,
    message,
  })
}
