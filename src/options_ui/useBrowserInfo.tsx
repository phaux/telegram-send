import { runtime } from "webextension-polyfill"
import { useLoader } from "../common/useLoader"

export function useBrowserInfo() {
  const browserInfo = useLoader(async () => {
    return await runtime.getBrowserInfo()
  }, [])

  return browserInfo.value
}
