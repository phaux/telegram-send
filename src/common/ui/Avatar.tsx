import { ComponentProps } from "react"
import styled, { css } from "styled-components"
import type { Override } from "./Override"

const emptySrc =
  "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

type AvatarComponentProps = Override<ComponentProps<"img">, AvatarProps>

function AvatarComponent(props: AvatarComponentProps) {
  const { size, color, src, ...imgProps } = props
  return <img src={src ?? emptySrc} {...imgProps} />
}

interface AvatarProps {
  size: number
  color?: "default" | "primary" | "secondary"
}

export const Avatar = styled(AvatarComponent)<AvatarProps>((props) => {
  const { size, color = "default" } = props
  const cssColor =
    color === "default"
      ? "var(--app-inactive)"
      : color === "primary"
      ? "var(--app-primary)"
      : color === "secondary"
      ? "var(--app-secondary)"
      : "transparent"
  return css`
    width: calc(var(--app-spacing, 8px) * ${size});
    height: calc(var(--app-spacing, 8px) * ${size});
    border-radius: 50%;
    background-color: ${cssColor};
  `
})
