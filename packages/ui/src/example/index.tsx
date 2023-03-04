import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import { Accordion, Button, ButtonGroup, Checkbox, Code, Icon, Input, Navbar, PluginUI, Scrubber, Select, SelectOption, ThemeType } from '..'
import './index.scss'
import { PluginWindow } from './PluginWindow'

export interface ExampleState {
  theme: ThemeType
  time: number
  duration: number
  delay: number
  rotation: number
  opacity: number
  text: string
  checked: boolean
  selected?: string | number | boolean
  options: SelectOption[]
  accordion: boolean
  groupValue: string
}

const code = '<html><head></head><body></html>'

export class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    theme: 'dark',
    time: 1.2,
    duration: 0.5,
    delay: 0.25,
    rotation: 90,
    opacity: 0.85,
    text: 'Text',
    checked: false,
    options: [
      { value: 'first', title: 'First', icon: 'ui-clipboard' },
      { value: 'second', title: 'Second' },
      { value: 'third', title: 'Third' }
    ],
    accordion: false,
    selected: 'first',
    groupValue: 'first'
  }

  render() {
    return (
      <PluginWindow title="Figmania UI">
        <PluginUI theme={this.state.theme}>
          <Navbar icon="ui-clipboard" title="Navbar with Buttons">
            <Button icon="ui-clipboard" title="Copy" onClick={() => {
              this.setState({ time: 5 })
            }}></Button>
            <Button icon="ui-download" title="Download"></Button>
            <Button icon="animation-opacity" title={`Theme: ${this.state.theme}`} onClick={() => {
              this.setState({ theme: this.state.theme === 'dark' ? 'light' : 'dark' })
            }} />
          </Navbar>
          <div className={'container'}>
            <header>Small Button with icon</header>
            <div className="panel">
              <Button size='sm' icon='ui-visible'></Button>
              <Button size='sm' icon='ui-hidden'></Button>
              <Button size='sm' icon='ui-info'></Button>
              <Button size='sm' icon='control-loop'></Button>
              <Button size='sm' icon='control-pause'></Button>
              <Button size='sm' icon='control-play'></Button>
              <Button size='sm' icon='control-reset'></Button>
            </div>
            <header>Scrubber</header>
            <div className="panel">
              <Scrubber value={this.state.time} duration={10} onChange={(value) => { this.setState({ time: value }) }} />
            </div>
            <header>Navbar with icon</header>
            <div className="panel">
              <Navbar isDisabled icon="ui-clipboard" title="Navbar with Icon"></Navbar>
            </div>
            <header>Code</header>
            <div className="panel">
              <Code source={code} indent />
            </div>
            <header>Accordion</header>
            <div className="panel">
              <Accordion title="First Item" active={this.state.accordion} activate={() => { this.setState({ accordion: !this.state.accordion }) }}><Navbar title="First Item Active"></Navbar></Accordion>
              <Accordion title="Second Item" active={!this.state.accordion} activate={() => { this.setState({ accordion: !this.state.accordion }) }}><Navbar title="Second Item Active"></Navbar></Accordion>
            </div>
            <header>Select</header>
            <div className="panel">
              <Select value={this.state.selected} icon="animation-translate-y" options={this.state.options} placeholder="Choose Option" onChange={(option) => this.setState({ selected: option.value })}></Select>
            </div>
            <header>Uncontrolled Select</header>
            <div className="panel">
              <Select icon="animation-translate-y" options={this.state.options} placeholder="Choose Option" onChange={(option) => { console.info('select', option) }}></Select>
            </div>
            <header>Checkbox</header>
            <div className="panel">
              <Checkbox name="check" title="Checked" value={this.state.checked} onChange={(checked) => { this.setState({ checked }) }}></Checkbox>
            </div>
            <header>Input</header>
            <div className="panel">
              <Input name="duration" icon="transition-duration" type="number" placeholder="500ms" suffix="ms" inputOpts={{ min: 0, max: 10000, step: 100 }} fraction={0.001} value={this.state.duration} defaultValue={0.5} onChange={(duration) => { console.info({ duration }); this.setState({ duration: +duration }) }}></Input>
              <Input name="delay" icon="transition-delay" type="number" placeholder="500ms" suffix="ms" inputOpts={{ min: 0, max: 10000, step: 100 }} fraction={0.001} value={this.state.delay} onChange={(delay) => { this.setState({ delay: +delay }) }}></Input>
              <Input name="rotation" icon="animation-rotate" type="number" placeholder="0°" suffix="°" inputOpts={{ min: -360, max: 360, step: 10 }} value={this.state.rotation} onChange={(rotation) => { this.setState({ rotation: +rotation }) }}></Input>
              <Input name="opacity" icon="animation-opacity" type="number" placeholder="100%" suffix="%" inputOpts={{ min: 0, max: 100, step: 10 }} fraction={0.01} value={this.state.opacity} onChange={(opacity) => { this.setState({ opacity: +opacity }) }}></Input>
              <Input name="text" type='text' placeholder="Your Text" value={this.state.text} onChange={(text) => { this.setState({ text: text as string }) }} />
            </div>
            <header>Icon</header>
            <div className="panel">
              <Icon icon="ui-clipboard"></Icon>
            </div>
            <header>Button with title</header>
            <div className="panel">
              <Button icon="ui-clipboard" title="Clip content"></Button>
            </div>
            <header>Button without title</header>
            <div className="panel">
              <Button icon="ui-clipboard"></Button>
            </div>
            <header>Button without icon</header>
            <div className="panel">
              <Button title="Awesome"></Button>
            </div>
            <header>Button selected</header>
            <div className="panel">
              <Button icon="ui-clipboard" title="Clip content" isSelected={true}></Button>
            </div>
            <header>Button disabled</header>
            <div className="panel">
              <Button icon="ui-clipboard" title="Clip content" isDisabled={true}></Button>
            </div>
            <header>Button group</header>
            <div className="panel">
              <ButtonGroup>
                <Button icon="ui-animate-on" isSelected={this.state.groupValue === 'first'} onClick={() => { this.setState({ groupValue: 'first' }) }}></Button>
                <Button icon="ui-animate-off" isSelected={this.state.groupValue === 'second'} onClick={() => { this.setState({ groupValue: 'second' }) }}></Button>
              </ButtonGroup>
            </div>
          </div>
        </PluginUI>
      </PluginWindow>
    )
  }
}

const root = createRoot(document.getElementById('root')!)
root.render(<Example />)
