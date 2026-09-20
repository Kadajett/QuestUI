"use client"
import {TextInput, type TextInputProps} from '@astryxdesign/core/TextInput'
import {controlStyles} from './controls.stylex'

export type QuestInputProps = TextInputProps

export function Input({xstyle, ...props}: QuestInputProps) {
  return <TextInput {...props} xstyle={[controlStyles.field,
    props.isReadOnly && controlStyles.readOnly,
    props.status?.type === 'error' && controlStyles.invalid,
    props.isDisabled && controlStyles.disabled, xstyle]}/>
}
