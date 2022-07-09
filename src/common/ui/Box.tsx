import { ComponentProps } from "react"
import styled, { css } from "styled-components"
import type { Override } from "./Override"

type BoxComponentProps = Override<ComponentProps<"div">, BoxProps> & {
  component?: keyof JSX.IntrinsicElements
}

function BoxComponent(props: BoxComponentProps) {
  const {
    component: Component = "div",
    direction,
    align,
    justify,
    flex,
    spacing,
    m,
    mx,
    my,
    ...containerProps
  } = props

  return <Component {...(containerProps as any)} />
}

interface BoxProps {
  direction?: "column" | "row"
  align?: "start" | "end" | "center" | "baseline" | "stretch"
  justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly"
  flex?: number
  spacing?: number
  m?: number
  mx?: number
  my?: number
}

export const Box = styled(BoxComponent)<BoxProps>((props) => {
  const {
    direction = "column",
    align = direction === "column" ? "stretch" : "center",
    justify = "start",
    flex = 0,
    spacing = 0,
    m = 0,
    mx = m,
    my = m,
  } = props

  return css`
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justify};
    flex: ${flex};
    column-gap: calc(var(--app-spacing, 8px) * ${spacing});
    row-gap: calc(var(--app-spacing, 8px) * ${spacing});
    margin: calc(var(--app-spacing, 8px) * ${my}) calc(var(--app-spacing, 8px) * ${mx});
  `
})
