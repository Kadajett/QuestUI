'use client'

import {ToggleButton, type ToggleButtonProps} from '@astryxdesign/core/ToggleButton'
import {controlStyles} from './controls.stylex'
import {formExtraStyles} from './form-extra.stylex'

export type QuestToggleProps = ToggleButtonProps

export function Toggle({xstyle, ...props}: QuestToggleProps) {
  return <ToggleButton {...props} xstyle={[controlStyles.field, formExtraStyles.toggle,
    props.isDisabled && controlStyles.disabled, xstyle]} />
}
