"use client"
import {FieldLabel, type FieldLabelProps} from '@astryxdesign/core/Field'
import {controlStyles} from './controls.stylex'

export type QuestLabelProps = FieldLabelProps

export function Label({xstyle, ...props}: QuestLabelProps) {
  return <FieldLabel {...props} xstyle={[controlStyles.label, props.isDisabled && controlStyles.disabled, xstyle]}/>
}
