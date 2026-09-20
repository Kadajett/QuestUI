'use client'

import {Children, useImperativeHandle, useRef, type KeyboardEvent} from 'react'
import {Carousel as NativeCarousel, type CarouselProps, type CarouselHandle} from '@astryxdesign/core/Carousel'
import {dataStyles} from './data-extra.styles'

export type QuestCarouselProps = CarouselProps
export type QuestCarouselHandle = CarouselHandle

function scrollFromKey(event: KeyboardEvent<HTMLElement>, carousel: CarouselHandle | null, itemCount: number): void {
  if (event.defaultPrevented || event.target !== event.currentTarget.firstElementChild || !carousel) return
  const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
  if (event.key === 'Home') carousel.scrollTo(0)
  else if (event.key === 'End') carousel.scrollTo(itemCount - 1)
  else if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) carousel.scrollNext()
  else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) carousel.scrollPrev()
  else return
  event.preventDefault()
}

/** Native overflow, snap points and disabled-edge buttons; arrows/Home/End work on the scroller. */
export function Carousel({xstyle, onKeyDown, handleRef, children, ...props}: QuestCarouselProps) {
  const handle = useRef<CarouselHandle>(null)
  useImperativeHandle(handleRef, () => ({
    scrollNext: () => handle.current?.scrollNext(),
    scrollPrev: () => handle.current?.scrollPrev(),
    scrollTo: index => handle.current?.scrollTo(index),
    canScrollNext: () => handle.current?.canScrollNext() ?? false,
    canScrollPrev: () => handle.current?.canScrollPrev() ?? false,
  }), [])
  return <NativeCarousel hasSnap hasEdgeFade={false} gap={3} {...props} handleRef={handle}
    xstyle={[dataStyles.frame, xstyle]} onKeyDown={event => {
      onKeyDown?.(event)
      scrollFromKey(event, handle.current, Children.toArray(children).length)
    }}>{children}</NativeCarousel>
}
