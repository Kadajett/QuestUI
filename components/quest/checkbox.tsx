"use client"
import {CheckboxInput, type CheckboxInputProps} from '@astryxdesign/core/CheckboxInput'
import {Stack} from '@astryxdesign/core/Stack'
import * as stylex from '@stylexjs/stylex'
import {controlStyles} from './controls.stylex'

const styles = stylex.create({
  root: {paddingInlineStart: 'var(--spacing-3)'},
  visibleUnchecked: {'--q-card': 'var(--q-input)'},
  labelOffset: {width: 'var(--spacing-1)', flexShrink: 0},
})
const visibleUncheckedClassName = stylex.props(styles.visibleUnchecked).className

export type QuestCheckboxProps = CheckboxInputProps
export function Checkbox({xstyle, labelIcon, className, ...props}: QuestCheckboxProps) {
  return <CheckboxInput {...props} labelIcon={labelIcon ?? <Stack as="span" aria-hidden xstyle={styles.labelOffset} />}
    className={[visibleUncheckedClassName, className].filter(Boolean).join(' ')}
    xstyle={[styles.root, controlStyles.choice, xstyle]}/>
}
