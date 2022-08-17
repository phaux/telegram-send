import { useEffect, useState } from "react"
import {
  addSyncStorageListener,
  getSyncStorage,
  setSyncStorage,
  SyncStorage,
} from "webext-typed-storage"

declare module "webext-typed-storage" {
  export interface SyncStorage {
    botToken: string
    chatIds: string[]
  }
}

export function useAppStorage() {
  type Storage = Partial<SyncStorage> & { isLoading: boolean }
  const [storage, setStorage] = useState<Storage>({
    isLoading: true,
  })

  useEffect(() => {
    getSyncStorage(null)
      .then((storage) => setStorage({ ...storage, isLoading: false }))
      .catch(() => null)

    return addSyncStorageListener((newStorage) =>
      setStorage((storage) => ({ ...storage, ...newStorage }))
    )
  }, [])

  async function updateStorage(storage: Partial<SyncStorage>): Promise<void> {
    await setSyncStorage(storage)
    setStorage((oldStorage) => ({ ...oldStorage, ...storage }))
  }

  return [storage, updateStorage] as const
}
