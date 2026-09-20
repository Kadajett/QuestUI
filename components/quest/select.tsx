"use client"
import {Selector, type SelectorProps, type SelectorOptionData} from '@astryxdesign/core/Selector'
import {controlStyles} from './controls.stylex'

export type QuestSelectProps = SelectorProps
export type QuestSelectOption = SelectorOptionData

export function Select({xstyle, size = 'md', isDisabled = false, ...props}: QuestSelectProps) {
  return <Selector {...props} size={size} isDisabled={isDisabled}
    xstyle={[controlStyles.field, controlStyles.select, isDisabled && controlStyles.disabled, xstyle]}/>
}
