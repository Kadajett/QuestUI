import {useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {Progress} from './components/quest/progress'
import {Skeleton} from './components/quest/skeleton'
import {Tooltip} from './components/quest/tooltip'

function TooltipExample() {
  const [potions, setPotions] = useState(3)
  return <Stack as="section" id="tooltip" aria-labelledby="tooltip-heading" gap={4}>
    <Heading level={2} id="tooltip-heading">Tooltip</Heading>
    <Text type="supporting">Hover or focus for a hint. Escape dismisses it without moving focus.</Text>
    <Card><CardContent><Stack gap={4} hAlign="start">
      <Tooltip content="Restores 20 health. Save one for the boss." placement="above">
        <Button variant="secondary" onClick={() => setPotions(value => Math.max(0, value - 1))} disabled={potions === 0}>
          Drink potion
        </Button>
      </Tooltip>
      <Text as="p" role="status">{potions} potions remaining</Text>
      <Button variant="ghost" size="sm" onClick={() => setPotions(3)}>Refill potions</Button>
    </Stack></CardContent></Card>
  </Stack>
}

function ProgressExample() {
  const [experience, setExperience] = useState(40)
  const [searching, setSearching] = useState(false)
  return <Stack as="section" id="progress" aria-labelledby="progress-heading" gap={4}>
    <Heading level={2} id="progress-heading">Progress</Heading>
    <Text type="supporting">Earn experience or show a search whose duration is unknown.</Text>
    <Card><CardContent><Stack gap={4}>
      <Progress label="Experience" value={experience} hasValueLabel/>
      <Stack direction="horizontal" gap={3} wrap="wrap">
        <Button onClick={() => setExperience(value => Math.min(100, value + 20))} disabled={experience === 100}>Earn 20 XP</Button>
        <Button variant="outline" onClick={() => setExperience(0)}>Reset XP</Button>
      </Stack>
      <Progress label="Finding a party" value={searching ? 0 : 100} isIndeterminate={searching} variant="neutral"/>
      <Stack hAlign="start">
        <Button variant="secondary" onClick={() => setSearching(value => !value)}>{searching ? 'Cancel search' : 'Find a party'}</Button>
      </Stack>
      <Text as="p" role="status">{searching ? 'Searching for adventurers…' : 'Ready for your next expedition.'}</Text>
    </Stack></CardContent></Card>
  </Stack>
}

function SkeletonExample() {
  const [loading, setLoading] = useState(true)
  return <Stack as="section" id="skeleton" aria-labelledby="skeleton-heading" gap={4}>
    <Heading level={2} id="skeleton-heading">Skeleton</Heading>
    <Text type="supporting">Pixel placeholders keep their shape with reduced motion enabled.</Text>
    <Card><CardContent><Stack gap={4}>
      <Stack role="region" aria-label="Adventurer profile" aria-busy={loading} gap={3} style={{minHeight: 148}}>
        {loading ? <>
          <Skeleton width={64} height={64}/>
          <Skeleton width="60%" height={28} index={1}/>
          <Skeleton width="85%" height={24} index={2}/>
        </> : <>
          <Heading level={3}>Rowan the Brave</Heading>
          <Text as="p">Level 12 ranger · Crystal caverns</Text>
          <Text as="p">Ready to join your next expedition.</Text>
        </>}
      </Stack>
      <Text as="p" role="status">{loading ? 'Loading adventurer profile…' : 'Adventurer profile loaded.'}</Text>
      <Stack hAlign="start">
        <Button variant="outline" onClick={() => setLoading(value => !value)}>{loading ? 'Reveal profile' : 'Load profile again'}</Button>
      </Stack>
    </Stack></CardContent></Card>
  </Stack>
}

export function FeedbackExamples() {
  return <><TooltipExample/><ProgressExample/><SkeletonExample/></>
}
