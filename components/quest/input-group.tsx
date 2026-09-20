'use client'

import {createContext, use} from 'react'
import {InputGroup as AstryxInputGroup, InputGroupText as AstryxInputGroupText, type InputGroupProps, type InputGroupTextProps} from '@astryxdesign/core/InputGroup'
import {Input, type QuestInputProps} from './input'
import {controlStyles} from './controls.stylex'
import {formExtraStyles} from './form-extra.stylex'

export type QuestInputGroupProps = InputGroupProps
export type QuestInputGroupTextProps = InputGroupTextProps
export type QuestInputGroupInputProps = QuestInputProps

const InputGroupState = createContext<Pick<QuestInputGroupProps, 'isDisabled' | 'status'>>({})

export function InputGroup({xstyle, ...props}: QuestInputGroupProps) {
  const state: Pick<QuestInputGroupProps, 'isDisabled' | 'status'> = {
    ...(props.isDisabled === undefined ? {} : {isDisabled: props.isDisabled}),
    ...(props.status === undefined ? {} : {status: props.status}),
  }
  return <InputGroupState value={state}>
    <AstryxInputGroup {...props} xstyle={[controlStyles.field, formExtraStyles.group,
      props.status?.type === 'error' && controlStyles.invalid,
      props.isDisabled && controlStyles.disabled, xstyle]} />
  </InputGroupState>
}

export function InputGroupText({xstyle, ...props}: QuestInputGroupTextProps) {
  return <AstryxInputGroupText {...props} xstyle={[formExtraStyles.addon, xstyle]} />
}

/** Retains the shared group border while using Quest's input typography. */
export function InputGroupInput({xstyle, ...props}: QuestInputGroupInputProps) {
  const group = use(InputGroupState)
  const isDisabled = group.isDisabled || props.isDisabled
  const status = props.status ?? (group.status ? {type: group.status.type} : undefined)
  return <Input {...props}
    {...(isDisabled === undefined ? {} : {isDisabled})}
    {...(status === undefined ? {} : {status})}
    xstyle={[formExtraStyles.groupInput, xstyle]} />
}
