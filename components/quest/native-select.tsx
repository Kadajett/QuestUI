'use client'

import type {ComponentProps} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Field, type QuestFieldProps} from './field'
import {controlStyles} from './controls.stylex'

export type QuestNativeSelectProps = ComponentProps<'select'> & {
  label: string
  description?: string
  status?: QuestFieldProps['status']
  isLabelHidden?: boolean
  xstyle?: stylex.StyleXStyles
}

/** A real select: options, optgroups, form submission and keyboard behavior stay native. */
export function NativeSelect({label, description, status, isLabelHidden, xstyle, className, style,
  id, disabled, required, children, 'aria-describedby': describedBy, ...props}: QuestNativeSelectProps) {
  const css = stylex.props(controlStyles.field, disabled && controlStyles.disabled,
    status?.type === 'error' && controlStyles.invalid, xstyle)
  const fieldProps = {
    ...(id === undefined ? {} : {inputID: id}),
    ...(description === undefined ? {} : {description}),
    ...(status === undefined ? {} : {status}),
    ...(isLabelHidden === undefined ? {} : {isLabelHidden}),
    ...(disabled === undefined ? {} : {isDisabled: disabled}),
    ...(required === undefined ? {} : {isRequired: required}),
  }
  return <Field label={label} {...fieldProps}>
    {control => <select {...control} {...props} disabled={disabled} required={required}
      aria-describedby={[control['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined}
      className={[css.className, className].filter(Boolean).join(' ')} style={{...css.style, ...style}}>{children}</select>}
  </Field>
}
