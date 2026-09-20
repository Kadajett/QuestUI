"use client"
import {Switch as AstryxSwitch, type SwitchProps} from '@astryxdesign/core/Switch'
import {controlStyles} from './controls.stylex'

export type QuestSwitchProps = SwitchProps
export function Switch({xstyle, ...props}: QuestSwitchProps) {
  return <AstryxSwitch {...props} xstyle={[controlStyles.choice, props.isDisabled && controlStyles.disabled, xstyle]}/>
}
