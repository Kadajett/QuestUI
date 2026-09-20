import type {ReactNode} from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Tooltip} from '../../components/quest/tooltip'
import {Progress} from '../../components/quest/progress'
import {Skeleton} from '../../components/quest/skeleton'

function Quest({children}: {children: ReactNode}) {
  return <Theme theme={questTheme} mode="light">{children}</Theme>
}

describe('Tooltip', () => {
  it('describes a focused trigger and dismisses with Escape without moving focus', async () => {
    const user = userEvent.setup()
    render(<Tooltip content="Restores 20 health" delay={0}><button>Drink potion</button></Tooltip>, {wrapper: Quest})
    await user.tab()
    const trigger = screen.getByRole('button', {name: 'Drink potion'})
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Restores 20 health')
    expect(trigger).toHaveAccessibleDescription('Restores 20 health')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('opens on hover and dismisses when the pointer leaves', async () => {
    const user = userEvent.setup()
    render(<Tooltip content="Bring a lantern" delay={0}><button>Travel hint</button></Tooltip>, {wrapper: Quest})
    const trigger = screen.getByRole('button', {name: 'Travel hint'})
    await user.hover(trigger)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Bring a lantern')
    await user.unhover(trigger)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('honors a controlled dismissal and preserves an existing description', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<>
      <p id="existing-hint">Three remaining.</p>
      <Tooltip content="Restores 20 health" isOpen>
        <button aria-describedby="existing-hint">Drink potion</button>
      </Tooltip>
    </>, {wrapper: Quest})
    const trigger = screen.getByRole('button', {name: 'Drink potion'})
    await screen.findByRole('tooltip')
    expect(trigger).toHaveAccessibleDescription('Three remaining. Restores 20 health')
    await user.keyboard('{Escape}')
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    rerender(<Tooltip content="Restores 20 health" isOpen={false}><button>Drink potion</button></Tooltip>)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })
})

describe('Progress', () => {
  it('announces a custom range and clamps values to its accessible bounds', () => {
    const {rerender} = render(<Progress label="Crystals collected" value={3} max={8} hasValueLabel formatValueLabel={(value, max) => `${value} of ${max} crystals`}/>, {wrapper: Quest})
    const bar = screen.getByRole('progressbar', {name: 'Crystals collected'})
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '8')
    expect(bar).toHaveAttribute('aria-valuetext', '3 of 8 crystals')
    expect(screen.getByText('3 of 8 crystals')).toBeVisible()
    rerender(<Progress label="Crystals collected" value={12} max={8}/>)
    expect(bar).toHaveAttribute('aria-valuenow', '8')
    rerender(<Progress label="Crystals collected" value={-2} max={8}/>)
    expect(bar).toHaveAttribute('aria-valuenow', '0')
  })

  it('does not invent a value during indeterminate work and restores it when known', () => {
    const {rerender} = render(<Progress label="Finding a party" value={40} isIndeterminate hasValueLabel/>, {wrapper: Quest})
    const bar = screen.getByRole('progressbar', {name: 'Finding a party'})
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).not.toHaveAttribute('aria-valuetext')
    expect(screen.queryByText('40%')).not.toBeInTheDocument()
    rerender(<Progress label="Finding a party" value={100} hasValueLabel/>)
    expect(bar).toHaveAttribute('aria-valuenow', '100')
    expect(bar).toHaveAttribute('aria-valuetext', '100%')
  })

  it('keeps invalid totals and non-finite values out of the accessible range', () => {
    render(<Progress label="Experience" max={-1} value={Number.NaN} isLabelHidden/>, {wrapper: Quest})
    const bar = screen.getByRole('progressbar', {name: 'Experience'})
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuenow', '0')
    expect(bar).toHaveAttribute('aria-valuetext', '0%')
  })
})

describe('Skeleton', () => {
  it('keeps decorative placeholders out of the accessibility tree of a busy region', () => {
    render(<section aria-label="Adventurer profile" aria-busy="true">
      <Skeleton width={64} height={64} data-testid="portrait"/>
      <p role="status">Loading adventurer profile</p>
    </section>, {wrapper: Quest})
    expect(screen.getByRole('region', {name: 'Adventurer profile'})).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('portrait')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading adventurer profile')
  })
})
