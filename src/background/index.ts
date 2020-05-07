import { refreshMenus } from "./refreshMenus"

browser.runtime.onInstalled.addListener((ev) => {
  if (ev.reason === "install") browser.runtime.openOptionsPage()
})

browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})

browser.storage.onChanged.addListener(() => {
  refreshPromise = refreshPromise.then(() => refreshMenus())
})
let refreshPromise = refreshMenus()

// browser.pageAction.onClicked.addListener((tab) => {
//   if (tab.id == null) return
//   browser.pageAction.hide(tab.id)
// })

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (tab.url == null) return
//   if (/test/.exec(tab.url)) {
//     browser.pageAction.show(tabId)
//   }
// })
