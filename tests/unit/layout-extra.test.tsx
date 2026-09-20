import type {ReactNode} from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Button} from '../../components/quest/button'
import {ButtonGroup} from '../../components/quest/button-group'
import {Item} from '../../components/quest/item'
import {Spinner} from '../../components/quest/spinner'
import {Typography, TypographyHeading, TypographyList, TypographyCode} from '../../components/quest/typography'
import {LayoutExtraExamples} from '../../demo-layout-extra'

function Quest({children}: {children: ReactNode}) {
  return <Theme theme={questTheme} mode="light">{children}</Theme>
}

describe('layout extras', () => {
  it('moves focus past disabled group members and disables the whole group', async () => {
    const user = userEvent.setup()
    const action = vi.fn()
    const buttons = <><Button onClick={action}>First</Button><Button disabled>Unavailable</Button><Button>Last</Button></>
    const {rerender} = render(<ButtonGroup label="Actions">{buttons}</ButtonGroup>, {wrapper: Quest})
    await user.tab()
    expect(screen.getByRole('button', {name: 'First'})).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'Last'})).toHaveFocus()
    await user.keyboard('{Home}{Enter}')
    expect(action).toHaveBeenCalledTimes(1)
    rerender(<ButtonGroup label="Actions" isDisabled>{buttons}</ButtonGroup>)
    expect(screen.getByRole('button', {name: 'First'})).toBeDisabled()
    expect(screen.getByRole('button', {name: 'Last'})).toBeDisabled()
    await user.click(screen.getByRole('button', {name: 'First'}))
    expect(action).toHaveBeenCalledTimes(1)
  })

  it('keeps item primary actions separate from nested actions', async () => {
    const user = userEvent.setup()
    const select = vi.fn()
    const archive = vi.fn()
    render(<Item label="Mountain quest" description="Bring a map" onClick={select}
      endContent={<Button onClick={archive}>Archive</Button>} />, {wrapper: Quest})
    await user.tab()
    await user.keyboard('{Enter}')
    expect(select).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', {name: 'Archive'}))
    expect(archive).toHaveBeenCalledTimes(1)
    expect(select).toHaveBeenCalledTimes(1)
  })

  it('allows the empty state action to add an item and archive it again', async () => {
    const user = userEvent.setup()
    render(<LayoutExtraExamples />, {wrapper: Quest})
    await user.click(screen.getByRole('button', {name: 'Find a quest'}))
    expect(screen.queryByRole('heading', {name: 'Your quest log is empty'})).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: /The mountain trail/}))
    expect(screen.getByText('Mountain trail selected')).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Archive'}))
    expect(screen.getByRole('heading', {name: 'Your quest log is empty'})).toBeVisible()
  })

  it('names the spinner from its label or an explicit accessible name', () => {
    const {rerender} = render(<Spinner label="Scouting the trail" />, {wrapper: Quest})
    expect(screen.getByRole('status', {name: 'Scouting the trail'})).toBeInTheDocument()
    rerender(<Spinner label="Scouting" aria-label="Searching for a safe path" />)
    expect(screen.getByRole('status', {name: 'Searching for a safe path'})).toBeInTheDocument()
  })

  it('renders headings and ordered lists with their document semantics', () => {
    render(<><TypographyHeading level={4}>Packing</TypographyHeading>
      <Typography>Use <TypographyCode>/pack</TypographyCode>.</Typography>
      <TypographyList as="ol" start={3}><li>Lantern</li><li>Map</li></TypographyList></>, {wrapper: Quest})
    expect(screen.getByRole('heading', {level: 4, name: 'Packing'})).toBeVisible()
    expect(screen.getByRole('list').tagName).toBe('OL')
    expect(screen.getByRole('list')).toHaveAttribute('start', '3')
    expect(screen.getByText('/pack').tagName).toBe('CODE')
  })
})
