import { useEffect, useState } from "react"
import { AppStorage, defaultAppStorage, getAppStorage, setAppStorage } from "./storage"

export function useAppStorage() {
  const [storage, setStorage] = useState({
    ...defaultAppStorage,
    isLoading: true,
  })

  useEffect(() => {
    getAppStorage()
      .then((storage) => setStorage({ ...storage, isLoading: false }))
      .catch(() => void 0)

    function handleStorageChange(changes: browser.storage.ChangeDict) {
      for (const [key, { newValue }] of Object.entries(changes)) {
        setStorage((oldStorage) => ({
          ...oldStorage,
          [key]: newValue as never,
        }))
      }
    }

    browser.storage.onChanged.addListener(handleStorageChange)
    return () => browser.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  return [
    storage,
    async (storage: Partial<AppStorage>): Promise<void> => {
      await setAppStorage(storage)
      setStorage((oldStorage) => ({ ...oldStorage, ...storage }))
    },
  ] as const
}
