import { refreshMenus } from "./refreshMenus"

chrome.runtime.onInstalled.addListener((ev) => {
  if (ev.reason === "install") {
    chrome.runtime.openOptionsPage()
  }
})

chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

chrome.storage.onChanged.addListener(() => {
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
