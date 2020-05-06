import * as React from "react"
import { AppStorage, defaultAppStorage, getAppStorage, setAppStorage } from "../storage"

export function useAppStorage() {
  const [storage, setStorage] = React.useState({ ...defaultAppStorage, isLoading: true })

  React.useEffect(() => {
    getAppStorage()
      .then((storage) => setStorage({ ...storage, isLoading: false }))
      .catch(() => {})

    function listener(changes: browser.storage.ChangeDict) {
      for (const [key, { newValue }] of Object.entries(changes)) {
        setStorage((oldStorage) => ({ ...oldStorage, [key]: newValue }))
      }
    }

    browser.storage.onChanged.addListener(listener)
    return () => browser.storage.onChanged.removeListener(listener)
  }, [])

  return [
    storage,
    async (storage: Partial<AppStorage>): Promise<void> => {
      await setAppStorage(storage)
      setStorage((oldStorage) => ({ ...oldStorage, ...storage }))
    },
  ] as const
}
