import { ComponentProps, ReactNode, useLayoutEffect, useRef, useState } from "react"
import styled, { css } from "styled-components"
import { Box } from "./Box"
import type { Override } from "./Override"
import { Txt } from "./Txt"

interface InputProps {
  label?: ReactNode
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  placeholder?: string
  help?: ReactNode
  error?: string
  monospace?: boolean
  selectOnFocus?: boolean
  inputProps?: ComponentProps<"input">
}

type Props = Override<ComponentProps<"div">, InputProps>

const Field = styled.input<{ monospace?: boolean; touched: boolean }>`
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--app-inactive);
  height: 36px;
  width: 100%;
  color: var(--app-text);
  transition: border-color 200ms;
  ${(props) =>
    props.monospace &&
    css`
      font-family: monospace;
    `}

  &:focus {
    border-color: currentColor;
  }

  &:disabled {
    color: var(--app-inactive);
  }

  &:invalid {
    box-shadow: none;
  }

  ${(props) =>
    props.touched &&
    css`
      &:invalid:not(:focus) {
        border-color: var(--app-error);
      }
    `}
`

export function Input(props: Props) {
  const {
    label,
    value,
    onChange,
    disabled,
    required,
    placeholder,
    help,
    error,
    monospace,
    selectOnFocus,
    inputProps,
    ...containerProps
  } = props

  const [touched, setTouched] = useState(false)
  const id = useRef(`input-${Math.random().toString(36).substr(2)}`)
  const inputRef = useRef<HTMLInputElement | null>(null)

  let bottomText = error ?? help
  if (bottomText === "") bottomText = <>&nbsp;</>

  useLayoutEffect(() => {
    inputRef.current!.setCustomValidity(error ?? "")
  }, [error])

  return (
    <Box {...(containerProps as any)}>
      {label != null && (
        <Txt component="label" variant="caption" my={0.5} htmlFor={id.current}>
          {label}
        </Txt>
      )}
      <Field
        ref={inputRef as any}
        touched={touched}
        monospace={monospace}
        {...inputProps}
        id={id.current}
        disabled={disabled ?? inputProps?.disabled}
        required={required ?? inputProps?.required}
        placeholder={placeholder ?? inputProps?.placeholder}
        value={value ?? inputProps?.value}
        onChange={(ev) => {
          onChange?.(ev.target.value)
          inputProps?.onChange?.(ev)
        }}
        onFocus={(ev) => {
          if (selectOnFocus) ev.target.select()
          setTouched(true)
          inputProps?.onFocus?.(ev)
        }}
      />

      <Txt component="output" variant="caption" my={0.5} color={error != null ? "error" : "alt"}>
        {bottomText}
      </Txt>
    </Box>
  )
}
