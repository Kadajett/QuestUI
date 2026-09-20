import {useState} from 'react'
import {Button} from '@/components/quest/button'
import {Card, CardContent} from '@/components/quest/card'
import {FormLayout} from '@astryxdesign/core/FormLayout'
import {Grid} from '@astryxdesign/core/Grid'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Checkbox} from '@/components/quest/checkbox'
import {Input} from '@/components/quest/input'
import {RadioGroup, RadioGroupItem} from '@/components/quest/radio-group'
import {Select} from '@/components/quest/select'
import {Slider} from '@/components/quest/slider'
import {Switch} from '@/components/quest/switch'
import {Textarea} from '@/components/quest/textarea'

const regions = [
  {value: 'overworld', label: 'Overworld'},
  {value: 'castle', label: 'Castle'},
  {value: 'islands', label: 'Sky islands (locked)', disabled: true},
]

function ProfileFields({name, onNameChange}: {name: string; onNameChange: (value: string) => void}) {
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('not-an-email')
  return <Card><CardContent>
    <Stack gap={4}>
      <Text as="h3" type="large">Adventurer profile</Text>
      <FormLayout>
        <Input label="Adventurer name" htmlName="name" isRequired value={name} onChange={onNameChange}/>
        <Textarea label="Your story" htmlName="bio" value={bio} onChange={setBio} placeholder="Every journey starts somewhere…"/>
        <Input label="Guild code (read only)" isReadOnly value="QUEST-0042"/>
        <Input label="Email (invalid example)" value={email} onChange={setEmail} status={{type: 'error', message: 'Enter a complete email address.'}}/>
        <Input label="Locked field" isDisabled value="" placeholder="Unlock at level 10"/>
      </FormLayout>
    </Stack>
  </CardContent></Card>
}

function PreferenceFields() {
  const [newsletter, setNewsletter] = useState(false)
  const [sound, setSound] = useState(true)
  const [volume, setVolume] = useState(60)
  return <FormLayout>
    <Checkbox label="Send me quest updates" value={newsletter} onChange={setNewsletter} htmlName="newsletter"/>
    <Switch label="Sound effects" value={sound} onChange={setSound} htmlName="sound"/>
    <Slider label="Volume" value={volume} onChange={setVolume} max={100} step={10} htmlName="volume" valueDisplay="text" formatValue={value => `${value}%`}/>
    <Text as="p" type="supporting" role="status">{newsletter ? 'Updates on' : 'Updates off'} · Sound {sound ? 'on' : 'off'}</Text>
  </FormLayout>
}

export function FormExamples() {
  const [name, setName] = useState('Mira')
  const [role, setRole] = useState('ranger')
  const [region, setRegion] = useState('overworld')
  const [saved, setSaved] = useState('')
  return <Stack as="section" id="forms" aria-labelledby="forms-heading" gap={5}>
    <Stack gap={2}>
      <Text as="h2" id="forms-heading" type="display-2">06 / Form controls</Text>
      <Text type="supporting">Native fields. Keyboard-ready choices.</Text>
    </Stack>
    <Stack as="form" onSubmit={event => {
      event.preventDefault()
      setSaved(name ? `${name}: ${role} in ${region}. Preferences saved.` : 'Enter an adventurer name before saving.')
    }}>
      <Grid columns={{minWidth: 280, max: 2}} gap={5}>
        <ProfileFields name={name} onNameChange={setName}/>
        <Card><CardContent>
          <Stack gap={4}>
            <Text as="h3" type="large">Adventure settings</Text>
            <FormLayout>
              <Select label="Starting region" value={region} onChange={setRegion} htmlName="region" options={regions} placeholder="Choose a region"/>
              <RadioGroup label="Character class" value={role} onChange={setRole} htmlName="class">
                <RadioGroupItem label="ranger" value="ranger"/>
                <RadioGroupItem label="mage" value="mage"/>
                <RadioGroupItem label="knight" value="knight"/>
              </RadioGroup>
              <PreferenceFields/>
              <Button type="submit" variant="primary">Save profile</Button>
              <Text as="p" role="status">{saved}</Text>
            </FormLayout>
          </Stack>
        </CardContent></Card>
      </Grid>
    </Stack>
  </Stack>
}
