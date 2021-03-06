import { getChat, sendMediaGroup, sendPhoto } from "../common/api"
import { sendTabMessage } from "../common/messages"
import { getAppStorage } from "../common/storage"

export async function refreshMenus() {
  await browser.menus.removeAll()
  const { botToken, chatIds } = await getAppStorage()

  for (const chatId of chatIds) {
    const chat = await getChat(botToken, chatId)
    const chatName = chat.title ?? chat.first_name ?? chat.id

    browser.menus.create({
      id: `sendPhoto-${botToken}-${chatId}`,
      contexts: ["image"],
      title: `Send image to ${chatName} ${chat.type}`,
      onclick: async (info, tab) => {
        const data = await sendTabMessage(tab.id!, "getPhoto", {
          elemId: info.targetElementId!,
        })
        if (data == null) return

        await sendPhoto(botToken, { chat_id: chatId, ...data }).catch((error) => {
          showError(`Sending photo to ${chatName} ${chat.type} failed: ${error.message}`)
        })
      },
    })

    browser.menus.create({
      id: `sendSelection-${botToken}-${chatId}`,
      contexts: ["selection"],
      title: `Send selection to ${chatName} ${chat.type}`,
      onclick: async (info, tab) => {
        const data = await sendTabMessage(tab.id!, "getSelection", undefined)
        if (data == null) return

        await sendMediaGroup(botToken, { chat_id: chatId, ...data }).catch((error) => {
          showError(`Sending selection to ${chatName} ${chat.type} failed: ${error.message}`)
        })
      },
    })
  }
}

function showError(message: string) {
  browser.notifications.create({
    type: "basic",
    title: "Telegram Send Error",
    message,
  })
}
