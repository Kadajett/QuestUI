'use client'

import {Selector, SelectorOption, type SelectorProps, type SelectorOptionData, type SelectorOptionType} from '@astryxdesign/core/Selector'
import * as stylex from '@stylexjs/stylex'
import {pickerStyles} from './picker.styles'

export type QuestComboboxProps<T extends SelectorOptionType = SelectorOptionType> = SelectorProps<T>
export type {SelectorOptionData, SelectorOptionType} from '@astryxdesign/core/Selector'

function PixelOption({option}: {option: SelectorOptionData}) {
  return <SelectorOption icon={option.icon} xstyle={pickerStyles.option}
    label={<span {...stylex.props(pickerStyles.optionLabel)}>{option.label ?? option.value}</span>}
    description={option.description && <span {...stylex.props(pickerStyles.optionDescription)}>{option.description}</span>} />
}

/** Astryx owns filtering, focus, option announcements, keyboard selection and dismissal. */
export function Combobox<T extends SelectorOptionType>({xstyle, renderOption, renderValue, ...props}: QuestComboboxProps<T>) {
  return <Selector {...props} hasSearch={props.hasSearch ?? true}
    renderOption={renderOption ?? (option => <PixelOption option={option} />)}
    renderValue={renderValue ?? (option => <SelectorOption icon={option.icon}
      label={<span {...stylex.props(pickerStyles.triggerLabel)}>{option.label ?? option.value}</span>}
      description={option.description} />)}
    xstyle={[pickerStyles.trigger, props.isDisabled && pickerStyles.disabled, xstyle]} />
}
