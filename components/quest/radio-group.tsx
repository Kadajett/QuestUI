"use client"
import {RadioList, RadioListItem, type RadioListProps, type RadioListItemProps} from '@astryxdesign/core/RadioList'
import * as stylex from '@stylexjs/stylex'
import {controlStyles} from './controls.stylex'
import './radio-group.css'

const styles = stylex.create({
  visibleUnchecked: {'--q-card': 'var(--q-input)'},
})
const visibleUncheckedClassName = stylex.props(styles.visibleUnchecked).className

export type QuestRadioGroupProps = RadioListProps
export type QuestRadioGroupItemProps = RadioListItemProps

export function RadioGroup({xstyle, ...props}: QuestRadioGroupProps) {
  return <RadioList {...props} xstyle={[xstyle]}/>
}
export function RadioGroupItem({xstyle, className, ...props}: QuestRadioGroupItemProps) {
  return <RadioListItem {...props}
    className={['quest-radio-item', visibleUncheckedClassName, className].filter(Boolean).join(' ')}
    xstyle={[controlStyles.choice, controlStyles.radio, xstyle]}/>
}
