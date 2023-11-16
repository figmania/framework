import clsx from 'clsx'
import { FunctionComponent, useState } from 'react'
import { Accordion, Button, ButtonGroup, Checkbox, Code, ICON, Icon, Navbar, NavigationBar, NumberInput, Scrubber, Select, SelectOption, Tabs, TextInput, tooltip, useClipboard } from '..'
import { Tab } from '../components/Tabs/Tab'
import styles from './App.module.scss'
import { Config } from './Schema'

export const App: FunctionComponent = () => {
  // const controller = useController<Schema>()
  const config: Config = { size: 'md', theme: 'dark' }

  // useEffect(() => {
  //   if (!controller) { return }
  //   controller.emit('test:message', 'hello world')
  //   controller.request('ping', 'World').then((response) => {
  //     logger.info('pong', response)
  //   })
  // }, [])

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [selectedNavIndex, setSelectedNavIndex] = useState(0)
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
    { value: 'first', label: 'First', icon: ICON.UI_CLIPBOARD },
    { value: 'second', label: 'Second' },
    { value: 'third', label: 'Third' }
  ]

  const icons = Object.values(ICON)
  const html = '<html><head></head><body></html>'

  return (
    <div>
      <Tabs selectedIndex={selectedTabIndex} items={[
        <Tab label='Effects' icon={ICON.APP_EFFECTS} {...tooltip('Explore our Effects')} />,
        <Tab label='Library' icon={ICON.APP_LIBRARY} {...tooltip('Explore our Library')} />,
        <Tab label='Share' icon={ICON.APP_SHARE} {...tooltip('Share on Social Media')} />
      ]} onChange={(index) => { setSelectedTabIndex(index) }}>
      </Tabs>
      <div className={styles['container']}>
        <header>Input</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <NumberInput {...tooltip('Duration of your animation')} fadeDefault name="duration" icon={ICON.TRANSITION_DURATION} suffix="ms" min={0} max={10} step={0.1} precision={3} value={duration} defaultValue={0.5} onChange={setDuration} />
          <NumberInput {...tooltip('Delay before your animation starts')} name="delay" icon={ICON.TRANSITION_DELAY} suffix="ms" min={0} max={10} step={0.1} precision={3} value={delay} defaultValue={0} onChange={setDelay} />
          <NumberInput {...tooltip('Amount of degrees the element should rotate')} name="rotation" icon={ICON.ANIMATE_ROTATION} suffix="°" min={-360} max={360} step={10} precision={0} value={rotation} defaultValue={0} onChange={setRotation} />
          <NumberInput {...tooltip('Opacity of the element in percent')} name="opacity" icon={ICON.ANIMATE_OPACITY} suffix="%" min={0} max={1} step={0.1} precision={2} value={opacity} defaultValue={1} onChange={setOpacity} />
          <TextInput {...tooltip('Type a wonderful text')} name="text" type='text' placeholder="Your Text" value={text} onChange={setText} />
        </div>
        <header>Icons</header>
        <div className={clsx(styles['panel'], styles['row'], styles['padding'])}>
          {icons.map((icon) => <Icon key={icon} size={config.size} icon={icon} />)}
        </div>
        <header>Icon Buttons</header>
        <div className={clsx(styles['panel'], styles['row'], styles['padding'])}>
          {icons.map((icon) => <Button key={icon} size={config.size} icon={icon} />)}
        </div>
        <header>Scrubber</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <NumberInput {...tooltip('Current time step in your animation. You can edit this field :-)')} name="time" icon={ICON.TRANSITION_DURATION} suffix="s" min={0} max={10} step={1} precision={1} value={time} defaultValue={0} onChange={setTime} />
          <Scrubber value={time} duration={10} onChange={(value) => { setTime(value) }} />
        </div>
        <header>Navbar</header>
        <div className={styles['panel']}>
          <Navbar icon={ICON.SYMBOL_COMPONENT} label="Navbar with Icon" />
          <Navbar disabled label="Navbar Disabled" />
        </div>
        <header>Code</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <Code value={html} indent />
          <Button {...tooltip('Click to copy the HTML code to your clipboard')} size={config.size} icon={ICON.UI_CLIPBOARD} label="Copy" onClick={() => { clipboard(html) }} />
        </div>
        <header>Accordion</header>
        <div className="panel">
          <Accordion label="First Item" active={accordion} activate={() => { setAccordion(!accordion) }}>
            <div className={clsx(styles['panel'], styles['padding-lg'])}>First Item Active</div>
          </Accordion>
          <Accordion label="Second Item" active={!accordion} activate={() => { setAccordion(!accordion) }}>
            <div className={clsx(styles['panel'], styles['padding-lg'])}>Second Item Active</div>
          </Accordion>
          <Accordion label="Disabled Item" disabled />
        </div>
        <header>Select</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['row'])}>
          <Select value={selected} icon={ICON.ANIMATE_Y} options={options} placeholder="Choose Option" onChange={(option) => { setSelected(option.value) }} />
          <Select icon={ICON.ANIMATE_Y} options={options} placeholder="Uncontrolled Select" />
        </div>
        <header>Checkbox</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Checkbox name="check" label="Checked" value={checked} onChange={(value) => { setChecked(value) }} />
        </div>
        <header>Button</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['row'])}>
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} label="With Icon" />
          <Button size={config.size} label="Plain" />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} label="Selected" selected />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} label="Focus" focus />
          <Button size={config.size} disabled icon={ICON.UI_CLIPBOARD} label="Disabled" />
          <ButtonGroup>
            <Button size={config.size} icon={ICON.ALIGN_HORIZONTAL_LEFT} selected={groupValue === 'first'} onClick={() => { setGroupValue('first') }} />
            <Button size={config.size} icon={ICON.ALIGN_HORIZONTAL_RIGHT} selected={groupValue === 'second'} onClick={() => { setGroupValue('second') }} />
          </ButtonGroup>
        </div>
      </div>
      <NavigationBar selectedIndex={selectedNavIndex} items={[
        { label: 'Effects', icon: ICON.APP_EFFECTS },
        { label: 'Library', icon: ICON.APP_LIBRARY },
        { label: 'Share', icon: ICON.APP_SHARE }
      ]} onChange={(_, index) => {
        setSelectedNavIndex(index)
      }} />
    </div>
  )
}
