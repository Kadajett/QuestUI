'use client'

import {useRef, useState, type ComponentProps, type KeyboardEvent} from 'react'
import {Stack} from '@astryxdesign/core/Stack'
import * as stylex from '@stylexjs/stylex'
import {Field, type QuestFieldProps} from './field'
import {controlStyles} from './controls.stylex'
import {formExtraStyles} from './form-extra.stylex'

export type QuestInputOTPProps = Omit<ComponentProps<'div'>, 'children' | 'defaultValue' | 'onChange'> & {
  label: string
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  name?: string
  disabled?: boolean
  required?: boolean
  description?: string
  status?: QuestFieldProps['status']
  xstyle?: stylex.StyleXStyles
}

const digitsOnly = (value: string) => value.replace(/\D/g, '')

const styles = stylex.create({
  disabledDigit: {
    opacity: 1,
    borderColor: 'var(--q-input)',
    backgroundColor: 'var(--q-muted)',
    color: 'var(--q-muted-foreground)',
    '@media (forced-colors: active)': {borderColor: 'GrayText', backgroundColor: 'Canvas', color: 'GrayText'},
  },
})

type OTPKeyContext = {
  index: number
  current: string
  length: number
  commit: (next: string) => void
  focus: (index: number) => void
}

function handleNavigationKey(event: KeyboardEvent<HTMLInputElement>, context: OTPKeyContext) {
  const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : undefined
  if (offset !== undefined) {
    event.preventDefault()
    context.focus(context.index + offset)
    return true
  }
  const boundary = event.key === 'Home' ? 0
    : event.key === 'End' ? Math.min(context.current.length, context.length - 1) : undefined
  if (boundary === undefined) return false
  event.preventDefault()
  context.focus(boundary)
  return true
}

function handleDeletionKey(event: KeyboardEvent<HTMLInputElement>, context: OTPKeyContext) {
  if (event.key === 'Delete') {
    event.preventDefault()
    context.commit(context.current.slice(0, context.index) + context.current.slice(context.index + 1))
    return
  }
  if (event.key !== 'Backspace') return
  event.preventDefault()
  const remove = context.current[context.index] ? context.index : Math.min(context.index - 1, context.current.length - 1)
  if (remove >= 0) context.commit(context.current.slice(0, remove) + context.current.slice(remove + 1))
  context.focus(Math.max(0, context.index - 1))
}

function handleOTPKeyDown(event: KeyboardEvent<HTMLInputElement>, context: OTPKeyContext) {
  if (handleNavigationKey(event, context)) return
  handleDeletionKey(event, context)
}

/** One logical value, with labelled digit slots and native one-time-code autofill. */
export function InputOTP({label, length = 6, value, defaultValue = '', onChange, onComplete,
  name, disabled = false, required = false, description, status, xstyle, ref, ...props}: QuestInputOTPProps) {
  if (!Number.isInteger(length) || length < 1) throw new RangeError('OTP length must be a positive integer')
  const [internal, setInternal] = useState(() => digitsOnly(defaultValue).slice(0, length))
  const current = digitsOnly(value ?? internal).slice(0, length)
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  const focus = (index: number) => inputs.current[Math.max(0, Math.min(index, length - 1))]?.focus()
  const commit = (next: string) => {
    if (disabled || next === current) return
    if (value === undefined) setInternal(next)
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }
  const insert = (index: number, text: string) => {
    const digits = digitsOnly(text)
    if (!digits) return
    const start = Math.min(index, current.length)
    const next = (current.slice(0, start) + digits + current.slice(start + digits.length)).slice(0, length)
    commit(next)
    focus(Math.min(start + digits.length, next.length))
  }
  const fieldOptionals = {
    ...(description === undefined ? {} : {description}),
    ...(status === undefined ? {} : {status}),
  }
  const stackRef = ref as ComponentProps<typeof Stack>['ref']
  return <Field label={label} isGroupLabel isDisabled={disabled} isRequired={required} {...fieldOptionals}>
    {control => <Stack {...props} {...(stackRef === undefined ? {} : {ref: stackRef})}
      direction="horizontal" role="group" aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']} aria-invalid={control['aria-invalid']} xstyle={[formExtraStyles.otp, xstyle]}>
      {Array.from({length}, (_, index) => <input key={index}
        ref={element => {inputs.current[index] = element}}
        id={index === 0 ? control.id : undefined} type="text" inputMode="numeric" pattern="[0-9]*"
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        aria-label={`${label}, digit ${index + 1} of ${length}`} aria-describedby={control['aria-describedby']}
        aria-invalid={control['aria-invalid']} disabled={disabled} required={required}
        value={current[index] ?? ''}
        {...stylex.props(controlStyles.field, formExtraStyles.digit,
          disabled && controlStyles.disabled, disabled && styles.disabledDigit,
          status?.type === 'error' && controlStyles.invalid)}
        onFocus={event => event.currentTarget.select()}
        onChange={event => {
          if (event.target.value === '') commit(current.slice(0, index) + current.slice(index + 1))
          else insert(index, event.target.value)
        }}
        onPaste={event => {event.preventDefault(); insert(index, event.clipboardData.getData('text'))}}
        onKeyDown={event => handleOTPKeyDown(event, {index, current, length, commit, focus})} />)}
      {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    </Stack>}
  </Field>
}
