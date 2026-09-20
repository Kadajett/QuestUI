import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Alert} from '../../components/quest/alert'

describe('Alert', () => {
  it('announces danger and dismisses through the public callback', async () => {
    const onDismiss = vi.fn()
    render(<Theme theme={questTheme}><Alert status="error" title="Party defeated" description="Return to camp" isDismissable dismissLabel="Dismiss defeat" onDismiss={onDismiss} /></Theme>)
    expect(screen.getByRole('alert')).toHaveTextContent('Return to camp')
    await userEvent.click(screen.getByRole('button', {name: 'Dismiss defeat'}))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
  it('keeps informational details available when not collapsible', () => {
    render(<Theme theme={questTheme}><Alert status="info" title="New quest" collapsible={false}><a href="#guild">Visit guild</a></Alert></Theme>)
    expect(screen.getByRole('status')).toHaveTextContent('New quest')
    expect(screen.getByRole('link', {name: 'Visit guild'})).toBeVisible()
  })
})
