import clsx from 'clsx'
import { FunctionComponent, useState } from 'react'
import { Accordion, Button, ButtonGroup, Checkbox, Code, ICON, Icon, Navbar, PluginUI, Scrubber, Select, SelectOption, TextInput, ThemeSize, ThemeType, useClipboard } from '..'
import { NumberInput } from '../components/NumberInput'
import styles from './App.module.scss'

export const App: FunctionComponent = () => {
  const [theme, setTheme] = useState<ThemeType>('dark')
  const [size, setSize] = useState<ThemeSize>('md')
  const [time, setTime] = useState<number>(1.2)
  const [duration, setDuration] = useState<number>(0.5)
  const [delay, setDelay] = useState<number>(0.25)
  const [rotation, setRotation] = useState<number>(90)
  const [opacity, setOpacity] = useState<number>(0.85)
  const [text, setText] = useState<string>('Text')
  const [checked, setChecked] = useState<boolean>(false)
  const [accordion, setAccordion] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>('first')
  const [groupValue, setGroupValue] = useState<string>('first')
  const clipboard = useClipboard()

  const options: SelectOption[] = [
    { value: 'first', title: 'First', icon: ICON.UI_CLIPBOARD },
    { value: 'second', title: 'Second' },
    { value: 'third', title: 'Third' }
  ]

  const icons = Object.values(ICON)
  const html = '<html><head></head><body></html>'

  return (
    <PluginUI theme={theme} >
      <Navbar icon={ICON.UI_INSTANCE} title="Components">
        <Button icon={ICON.ANIMATION_OPACITY} title={`Theme: ${theme.toUpperCase()}`} onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark') }} />
        <Button icon={ICON.ANIMATION_OPACITY} title={`Size: ${size.toUpperCase()}`} onClick={() => { setSize(size === 'md' ? 'sm' : 'md') }} />
      </Navbar>
      <div className={styles['container']}>
        <header>Input</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <NumberInput name="duration" icon={ICON.TRANSITION_DURATION} suffix="ms" min={0} max={10} step={0.1} precision={3} value={duration} defaultValue={0.5} onChange={setDuration} />
          <NumberInput name="delay" icon={ICON.TRANSITION_DELAY} suffix="ms" min={0} max={10} step={0.1} precision={3} value={delay} defaultValue={0} onChange={setDelay} />
          <NumberInput name="rotation" icon={ICON.ANIMATION_ROTATE} suffix="°" min={-360} max={360} step={10} precision={0} value={rotation} defaultValue={0} onChange={setRotation} />
          <NumberInput name="opacity" icon={ICON.ANIMATION_OPACITY} suffix="%" min={0} max={1} step={0.1} precision={2} value={opacity} defaultValue={1} onChange={setOpacity} />
          <TextInput name="text" type='text' placeholder="Your Text" value={text} onChange={setText} />
        </div>
        <header>Icons</header>
        <div className={clsx(styles['panel'], styles['row'], styles['padding'])}>
          {icons.map((icon) => <Icon key={icon} size={size} icon={icon} />)}
        </div>
        <header>Icon Buttons</header>
        <div className={clsx(styles['panel'], styles['row'], styles['padding'])}>
          {icons.map((icon) => <Button key={icon} size={size} icon={icon} />)}
        </div>
        <header>Scrubber</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <NumberInput name="time" icon={ICON.TRANSITION_DURATION} suffix="s" min={0} max={10} step={1} precision={1} value={time} defaultValue={0} onChange={setTime} />
          <Scrubber value={time} duration={10} onChange={(value) => { setTime(value) }} />
        </div>
        <header>Navbar</header>
        <div className={styles['panel']}>
          <Navbar icon={ICON.UI_INSTANCE} title="Navbar with Icon" />
          <Navbar disabled title="Navbar Disabled" />
        </div>
        <header>Code</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <Code value={html} indent />
          <Button size={size} icon={ICON.UI_CLIPBOARD} title="Copy" onClick={() => { clipboard(html) }} />
        </div>
        <header>Accordion</header>
        <div className="panel">
          <Accordion title="First Item" active={accordion} activate={() => { setAccordion(!accordion) }}>
            <div className={clsx(styles['panel'], styles['padding'])}>First Item Active</div>
          </Accordion>
          <Accordion title="Second Item" active={!accordion} activate={() => { setAccordion(!accordion) }}>
            <div className={clsx(styles['panel'], styles['padding'])}>First Item Active</div>
          </Accordion>
        </div>
        <header>Select</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Select value={selected} icon={ICON.ANIMATION_TRANSLATE_Y} options={options} placeholder="Choose Option" onChange={(option) => { setSelected(option.value) }} />
        </div>
        <header>Uncontrolled Select</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Select icon={ICON.ANIMATION_TRANSLATE_Y} options={options} placeholder="Choose Option" onChange={(option) => {
            console.info('select', option)
          }} />
        </div>
        <header>Checkbox</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Checkbox name="check" title="Checked" value={checked} onChange={(value) => { setChecked(value) }} />
        </div>
        <header>Button</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['row'])}>
          <Button size={size} icon={ICON.UI_CLIPBOARD} title="With Icon" />
          <Button size={size} title="Plain" />
          <Button size={size} icon={ICON.UI_CLIPBOARD} />
          <Button size={size} icon={ICON.UI_CLIPBOARD} title="Selected" selected={true} />
          <Button size={size} disabled icon={ICON.UI_CLIPBOARD} title="Disabled" />
        </div>
        <header>Button group</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <ButtonGroup>
            <Button size={size} icon={ICON.UI_ANIMATE_ON} title='First' selected={groupValue === 'first'} onClick={() => { setGroupValue('first') }} />
            <Button size={size} icon={ICON.UI_ANIMATE_OFF} title='Second' selected={groupValue === 'second'} onClick={() => { setGroupValue('second') }} />
          </ButtonGroup>
        </div>
      </div>
    </PluginUI >
  )
}
