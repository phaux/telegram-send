import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Config } from "./Config"

createRoot(document.body).render(
  <StrictMode>
    <Config />
  </StrictMode>
)
