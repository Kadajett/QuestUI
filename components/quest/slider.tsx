"use client"
import {Slider as AstryxSlider, type SliderProps} from '@astryxdesign/core/Slider'
import {controlStyles} from './controls.stylex'

export type QuestSliderProps = SliderProps

export function Slider({xstyle, ...props}: QuestSliderProps) {
  return <AstryxSlider {...props} xstyle={[controlStyles.choice, props.isDisabled && controlStyles.disabled, xstyle]}/>
}
