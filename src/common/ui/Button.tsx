import styled, { css, keyframes } from "styled-components"

const backgroundMove = keyframes`
  from {
    background-position-x: 0;
    background-size: 16px 16px;
  }
  to {
    background-position-x: 16px;
    background-size: 16px 16px;
  }
`

interface ButtonProps {
  color?: "primary" | "secondary"
  animation?: boolean
}

export const Button = styled.button<ButtonProps>`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  min-width: 36px;
  height: 36px;
  padding: 0 16px;
  border: none;
  background-color: ${(props) =>
    props.color != null ? `var(--app-${props.color})` : "transparent"};
  border-radius: 4px;
  box-shadow: ${(props) => (props.color != null ? "0 2px 6px rgba(0, 0, 0, 0.2)" : "none")};
  color: ${(props) => (props.color != null ? "white" : "var(--app-text)")};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 300ms, color 200ms;
  white-space: nowrap;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--app-highlight);
    content: "";
    opacity: 0;
    transition: opacity 200ms;
  }

  &:hover:not(:disabled)::before {
    opacity: 0.5;
    transition: opacity 100ms;
  }

  &:active:not(:disabled)::before {
    opacity: 1;
    transition: none;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 1%, transparent 1%);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 20000%;
    content: "";
    opacity: 0;
    transition: opacity 700ms, background 400ms;
  }

  &:active:not(:disabled)::after {
    background-size: 100%;
    opacity: 1;
    transition: none;
  }

  ${(props) =>
    props.animation
      ? css`
          animation: ${backgroundMove} 500ms linear infinite;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(0, 0, 0, 0.15) 50%,
            rgba(0, 0, 0, 0.15) 75%,
            transparent 75%,
            transparent 100%
          );
        `
      : css`
          &:disabled {
            background-color: ${props.color != null ? `var(--app-inactive)` : "transparent"};
            color: ${props.color == null ? `var(--app-inactive)` : "inherit"};
          }
        `}
`
