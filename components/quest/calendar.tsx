'use client'

import {Calendar as AstryxCalendar, type CalendarProps} from '@astryxdesign/core/Calendar'
import {pickerStyles} from './picker.styles'

export type QuestCalendarProps = CalendarProps
export type {DateRange, ISODateString, CalendarHandle} from '@astryxdesign/core/Calendar'

/** Native Astryx single/range selection and keyboard navigation, in Quest's pixel grid. */
export function Calendar({xstyle, ...props}: QuestCalendarProps) {
  return <AstryxCalendar {...props} xstyle={[pickerStyles.calendar, xstyle]} />
}
