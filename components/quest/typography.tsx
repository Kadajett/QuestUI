"use client"

import {createElement, type ComponentProps} from 'react'
import {Text} from '@astryxdesign/core/Text'
import {Heading} from '@astryxdesign/core/Heading'
import * as stylex from '@stylexjs/stylex'

export type QuestTypographyProps = ComponentProps<typeof Text>
export type QuestTypographyHeadingProps = ComponentProps<typeof Heading>
export type QuestTypographyListProps = ((ComponentProps<'ul'> & {as?: 'ul'}) | (ComponentProps<'ol'> & {as: 'ol'})) & {xstyle?: stylex.StyleXStyles}
export type QuestTypographyCodeProps = ComponentProps<'code'> & {xstyle?: stylex.StyleXStyles}

export const typographyStyles = stylex.create({
  paragraph: {fontFamily: 'var(--q-font-body)', marginBlock: '0 16px', lineHeight: 1.5},
  heading: {fontFamily: 'var(--q-font-display)', marginBlock: '0 16px', textWrap: 'balance'},
  list: {fontFamily: 'var(--q-font-body)', color: 'var(--q-foreground)', paddingInlineStart: 28, marginBlock: '0 16px', lineHeight: 1.5, listStyleType: 'square'},
  ordered: {listStyleType: 'decimal'},
  code: {
    fontFamily: 'var(--q-font-body)', fontSize: '1em', paddingBlock: 2, paddingInline: 6,
    backgroundColor: 'var(--q-muted)', color: 'var(--q-foreground)',
    borderWidth: 1, borderStyle: 'solid',
    borderColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    boxDecorationBreak: 'clone', overflowWrap: 'anywhere',
  },
})

export function Typography({as = 'p', xstyle, ...props}: QuestTypographyProps) {
  return <Text {...props} as={as} xstyle={[typographyStyles.paragraph, xstyle]} />
}

export function TypographyHeading({xstyle, ...props}: QuestTypographyHeadingProps) {
  return <Heading {...props} xstyle={[typographyStyles.heading, xstyle]} />
}

export function TypographyList({as: Tag = 'ul', xstyle, className, style, ...props}: QuestTypographyListProps) {
  const styled = stylex.props(typographyStyles.list, Tag === 'ol' && typographyStyles.ordered, xstyle)
  return createElement(Tag, {...props, ...styled, className: [styled.className, className].filter(Boolean).join(' '),
    style: {...styled.style, ...style}})
}

export function TypographyCode({xstyle, className, style, ...props}: QuestTypographyCodeProps) {
  const styled = stylex.props(typographyStyles.code, xstyle)
  return <code {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')}
    style={{...styled.style, ...style}} />
}
