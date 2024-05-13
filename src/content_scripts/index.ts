import { TgInputMediaPhoto, TgSendMediaGroupParams, TgSendPhotoParams } from "tinygram"
import { addTabMessageListener } from "webext-typed-messages"

declare module "webext-typed-messages" {
  export interface TabMessages {
    getPhoto: () => Omit<TgSendPhotoParams, "chat_id"> | null
    getSelection: () => Omit<TgSendMediaGroupParams, "chat_id"> | null
  }
}

let clickedElement: EventTarget | null = null

document.body.addEventListener("contextmenu", (event) => {
  clickedElement = event.target
})

addTabMessageListener({
  getPhoto() {
    if (!(clickedElement instanceof HTMLImageElement)) return null
    const url = getImageUrl(clickedElement)
    if (!url.startsWith("http")) return null

    return {
      photo: url,
      caption: location.href,
    }
  },
  getSelection() {
    const media: TgInputMediaPhoto[] = []

    const selection = window.getSelection()
    if (selection == null) return null

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
          ...(media.length === 0 ? { caption: location.href } : null),
        })
      }
    }

    if (media.length === 0) return null
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
