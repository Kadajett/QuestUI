'use client'

import {DateInput, type DateInputProps} from '@astryxdesign/core/DateInput'
import {DateRangeInput, type DateRangeInputProps} from '@astryxdesign/core/DateRangeInput'
import {controlStyles} from './controls.stylex'

export type QuestDatePickerProps = (DateInputProps & {mode?: 'single'}) | (DateRangeInputProps & {mode: 'range'})

/** Uses Astryx's calendar popover, date constraints, parsing and focus restoration. */
export function DatePicker(props: QuestDatePickerProps) {
  if (props.mode === 'range') {
    const {mode: _mode, xstyle, ...rangeProps} = props
    return <DateRangeInput {...rangeProps} xstyle={[controlStyles.field,
      props.status?.type === 'error' && controlStyles.invalid,
      props.isDisabled && controlStyles.disabled, xstyle]} />
  }
  const {mode: _mode, xstyle, ...dateProps} = props
  return <DateInput {...dateProps} xstyle={[controlStyles.field,
    props.status?.type === 'error' && controlStyles.invalid,
    props.isDisabled && controlStyles.disabled, xstyle]} />
}
