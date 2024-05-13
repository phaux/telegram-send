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
