import { refreshMenus } from "./refreshMenus"

chrome.runtime.onInstalled.addListener((ev) => {
  if (ev.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage().catch(() => null)
  }
})

chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage().catch(() => null)
})

chrome.storage.onChanged.addListener(() => {
  refreshPromise = refreshPromise.then(() => refreshMenus())
})
let refreshPromise = refreshMenus()
