import clsx from 'clsx'
import { FunctionComponent, useEffect, useState } from 'react'
import { Accordion, Button, ButtonGroup, Checkbox, Code, ICON, Icon, Navbar, NavigationBar, NumberInput, PluginUI, Scrubber, Select, SelectOption, Tabs, TextInput, ThemeSize, ThemeType, useClipboard, useConfig, useController, useLogger } from '..'
import styles from './App.module.scss'
import { Config, Schema } from './Schema'

export const App: FunctionComponent = () => {
  const controller = useController<Schema>()
  const [config, saveConfig] = useConfig<Config>()
  const logger = useLogger()

  useEffect(() => {
    controller.emit('test:message', 'hello world')
    controller.request('ping', 'World').then((response) => {
      logger.info('pong', response)
    })
  }, [])

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
    { value: 'first', title: 'First', icon: ICON.UI_CLIPBOARD },
    { value: 'second', title: 'Second' },
    { value: 'third', title: 'Third' }
  ]

  const themeOptions: SelectOption[] = [
    { value: 'default', title: 'Default' },
    { value: 'midnight', title: 'Midnight' },
    { value: 'dark', title: 'Dark' },
    { value: 'light', title: 'Light' }
  ]

  const sizeOptions: SelectOption[] = [
    { value: 'xs', title: 'XS' },
    { value: 'sm', title: 'SM' },
    { value: 'md', title: 'MD' },
    { value: 'lg', title: 'LG' },
    { value: 'xl', title: 'XL' }
  ]

  const icons = Object.values(ICON)
  const html = '<html><head></head><body></html>'

  return (
    <PluginUI theme={config.theme} minSize={{ width: 274, height: 40 }}>
      <Tabs selectedIndex={selectedTabIndex} items={[
        { title: 'Effects', icon: ICON.APP_EFFECTS },
        { title: 'Library', icon: ICON.APP_LIBRARY },
        { title: 'Share', icon: ICON.APP_SHARE }
      ]} onChange={(_, index) => {
        setSelectedTabIndex(index)
      }} />
      <Navbar title="Components">
        <Select value={config.theme} options={themeOptions} style={{ width: 100 }} onChange={({ value }) => {
          saveConfig({ theme: value as ThemeType })
        }} />
        <Select value={config.size} icon={ICON.STYLE_VERTICAL} options={sizeOptions} style={{ width: 80 }} onChange={({ value }) => {
          saveConfig({ size: value as ThemeSize })
        }} />
      </Navbar>
      <div className={styles['container']}>
        <header>Input</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <NumberInput fadeDefault name="duration" icon={ICON.TRANSITION_DURATION} suffix="ms" min={0} max={10} step={0.1} precision={3} value={duration} defaultValue={0.5} onChange={setDuration} />
          <NumberInput name="delay" icon={ICON.TRANSITION_DELAY} suffix="ms" min={0} max={10} step={0.1} precision={3} value={delay} defaultValue={0} onChange={setDelay} />
          <NumberInput name="rotation" icon={ICON.ANIMATE_ROTATION} suffix="°" min={-360} max={360} step={10} precision={0} value={rotation} defaultValue={0} onChange={setRotation} />
          <NumberInput name="opacity" icon={ICON.ANIMATE_OPACITY} suffix="%" min={0} max={1} step={0.1} precision={2} value={opacity} defaultValue={1} onChange={setOpacity} />
          <TextInput name="text" type='text' placeholder="Your Text" value={text} onChange={setText} />
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
          <NumberInput name="time" icon={ICON.TRANSITION_DURATION} suffix="s" min={0} max={10} step={1} precision={1} value={time} defaultValue={0} onChange={setTime} />
          <Scrubber value={time} duration={10} onChange={(value) => { setTime(value) }} />
        </div>
        <header>Navbar</header>
        <div className={styles['panel']}>
          <Navbar icon={ICON.SYMBOL_COMPONENT} title="Navbar with Icon" />
          <Navbar disabled title="Navbar Disabled" />
        </div>
        <header>Code</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['col'])}>
          <Code value={html} indent />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} title="Copy" onClick={() => { clipboard(html) }} />
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
          <Select value={selected} icon={ICON.ANIMATE_Y} options={options} placeholder="Choose Option" onChange={(option) => { setSelected(option.value) }} />
        </div>
        <header>Uncontrolled Select</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Select icon={ICON.ANIMATE_Y} options={options} placeholder="Choose Option" onChange={(option) => {
            console.info('select', option)
          }} />
        </div>
        <header>Checkbox</header>
        <div className={clsx(styles['panel'], styles['padding'])}>
          <Checkbox name="check" title="Checked" value={checked} onChange={(value) => { setChecked(value) }} />
        </div>
        <header>Button</header>
        <div className={clsx(styles['panel'], styles['padding'], styles['row'])}>
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} title="With Icon" />
          <Button size={config.size} title="Plain" />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} title="Selected" selected />
          <Button size={config.size} icon={ICON.UI_CLIPBOARD} title="Focus" focus />
          <Button size={config.size} disabled icon={ICON.UI_CLIPBOARD} title="Disabled" />
          <ButtonGroup>
            <Button size={config.size} icon={ICON.ALIGN_HORIZONTAL_LEFT} selected={groupValue === 'first'} onClick={() => { setGroupValue('first') }} />
            <Button size={config.size} icon={ICON.ALIGN_HORIZONTAL_RIGHT} selected={groupValue === 'second'} onClick={() => { setGroupValue('second') }} />
          </ButtonGroup>
        </div>
      </div>
      <NavigationBar selectedIndex={selectedNavIndex} items={[
        { title: 'Effects', icon: ICON.APP_EFFECTS },
        { title: 'Library', icon: ICON.APP_LIBRARY },
        { title: 'Share', icon: ICON.APP_SHARE }
      ]} onChange={(_, index) => {
        setSelectedNavIndex(index)
      }} />
    </PluginUI >
  )
}
