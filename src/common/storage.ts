import * as browser from "webextension-polyfill"

export type AppStorage = {
  botToken: string
  chatIds: string[]
}

export const defaultAppStorage: AppStorage = {
  botToken: "",
  chatIds: [],
}

export async function setAppStorage(storage: Partial<AppStorage>) {
  await browser.storage.sync.set(storage)
}

export async function getAppStorage(): Promise<AppStorage> {
  const storage = await browser.storage.sync.get(defaultAppStorage)
  return storage as AppStorage
}
