import type { TgSendMediaGroupData } from "../common/api"
import { registerMessageListener } from "../common/messages"

registerMessageListener({
  getPhoto({ elemId }) {
    const img = browser.menus.getTargetElement(elemId) as HTMLImageElement
    const url = getImageUrl(img)
    if (!url.startsWith("http")) return

    return {
      photo: url,
      caption: location.href,
    }
  },

  getSelection() {
    const media: TgSendMediaGroupData["media"] = []

    const selection = window.getSelection()
    if (selection == null) return

    for (let index = 0; index < selection.rangeCount; index += 1) {
      const range = selection.getRangeAt(index)
      const fragment = range.cloneContents()
      const elems = fragment.querySelectorAll("img")

      for (const elem of elems) {
        if (elem.width < 64 || elem.height < 64) continue
        const url = getImageUrl(elem)
        if (!url.startsWith("http")) continue

        media.push({
          type: "photo",
          media: url,
          caption: media.length === 0 ? location.href : undefined,
        })
      }
    }

    if (media.length === 0) return
    return { media }
  },
})

function getImageUrl(img: HTMLImageElement): string {
  let url = img.src
  const link = img.closest("a")
  if (link != null && /[.](jpg|png)$/i.exec(link.href)) {
    url = link.href
  }
  return url
}
