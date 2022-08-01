import { ReactNode } from "react"

export function Input(
  props: JSX.IntrinsicElements["input"] & {
    label?: ReactNode | null
    inputClassName?: string
    hint?: ReactNode | null
    error?: ReactNode | null
  }
) {
  const {
    className,
    type = "text",
    label,
    inputClassName,
    id,
    name,
    hint,
    error,
    ...inputProps
  } = props

  return (
    <div id={id} className={"flex flex-col gap-2 " + (className ?? "")}>
      {label != null ? (
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
      ) : null}

      <input
        name={name}
        id={name}
        type={type}
        className={
          "border rounded-md bg-transparent shadow-sm " +
          "border-gray-500 focus:border-accent-500 focus:ring-accent-500 " +
          (inputClassName ?? "")
        }
        aria-describedby={name != null ? `${name}-hint` : undefined}
        aria-invalid={error != null}
        aria-errormessage={name != null ? `${name}-error` : undefined}
        {...inputProps}
      />

      {hint != null && error == null ? (
        <p id={name != null ? `${name}-hint` : undefined} className="text-sm text-gray-500">
          {hint}
        </p>
      ) : null}

      {error != null ? (
        <p id={name != null ? `${name}-error` : undefined} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
