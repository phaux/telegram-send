import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Config } from "./Config"

const root = document.getElementById("root")
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Config />
    </StrictMode>
  )
}
