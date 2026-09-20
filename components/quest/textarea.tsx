"use client"
import {TextArea, type TextAreaProps} from '@astryxdesign/core/TextArea'
import {controlStyles} from './controls.stylex'

export type QuestTextareaProps = TextAreaProps

export function Textarea({xstyle, ...props}: QuestTextareaProps) {
  return <TextArea {...props} xstyle={[controlStyles.field, controlStyles.textarea,
    props.isReadOnly && controlStyles.readOnly,
    props.status?.type === 'error' && controlStyles.invalid,
    props.isDisabled && controlStyles.disabled, xstyle]}/>
}
