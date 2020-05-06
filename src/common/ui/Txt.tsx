import * as React from "react"
import styled, { css } from "styled-components"
import type { Override } from "./Override"

type TxtComponentProps = Override<
  React.ComponentProps<"p"> & React.ComponentProps<"label">,
  TxtProps
> & {
  component?: keyof JSX.IntrinsicElements
}

function TxtComponent(props: TxtComponentProps) {
  const {
    component: Component = "p",
    variant,
    color,
    align,
    m,
    mx,
    my,
    mb,
    mt,
    ...containerProps
  } = props

  return <Component {...(containerProps as any)} />
}

interface TxtProps {
  variant?: "body" | "header" | "caption"
  color?: "default" | "alt" | "error"
  align?: "inherit" | "left" | "right" | "center"
  m?: number
  mx?: number
  my?: number
  mt?: number
  mb?: number
}

export const Txt = styled(TxtComponent)<TxtProps>((props) => {
  const {
    variant = "body",
    color = "default",
    align = "inherit",
    m = 0,
    mx = m,
    my = m,
    mt = my,
    mb = my,
  } = props

  const cssColor =
    color === "default"
      ? "var(--app-text)"
      : color === "alt"
      ? "var(--app-text-alt)"
      : color === "error"
      ? "var(--app-error)"
      : "inherit"

  return css`
    text-align: ${align};
    color: ${cssColor};
    margin: calc(var(--app-spacing, 8px) * ${mt}) calc(var(--app-spacing, 8px) * ${mx})
      calc(var(--app-spacing, 8px) * ${mb});
    ${variant === "header"
      ? css`
          font-size: 1.5rem;
          font-weight: bold;
        `
      : variant === "caption"
      ? css`
          font-size: 0.9rem;
        `
      : null}
  `
})
