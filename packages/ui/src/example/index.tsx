import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import { Accordion, Button, ButtonGroup, Checkbox, Code, Icon, Input, Navbar, Scrubber, Select, SelectOption, Theme, ThemeType } from '..'
import './index.scss'

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

const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6025 5.00154C11.9415 5.35212 12.265 5.68688 12.5731 6.00749C15.6581 9.21687 17.2006 11.0111 17.2006 13.1924C17.2041 14.6798 16.6573 16.1684 15.5603 17.3031C13.3733 19.5656 9.82739 19.5656 7.64048 17.3031C6.54338 16.1684 5.99652 14.6798 6.00002 13.1924C6.00002 11.0111 7.54261 9.21687 10.6277 6.00749C10.9358 5.68688 11.2594 5.35212 11.5983 5.0014L11.5997 5L11.6025 5.00154ZM8.52686 10.4753C9.22956 9.52279 10.2331 8.43927 11.6004 7.01596C12.9675 8.43927 13.9712 9.52279 14.6737 10.4753C15.5135 11.6139 15.8005 12.4074 15.8005 13.1924V13.1957C15.8006 13.2638 15.7994 13.3318 15.7964 13.3997H7.40415C7.40135 13.3318 7.39995 13.2638 7.40009 13.1956V13.1924C7.40009 12.4074 7.6871 11.6139 8.52686 10.4753Z" fill="black"/>
</svg>
`

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
      <Theme className='container' theme={this.state.theme}>
        <header>Small Button with icon</header>
        <div className="panel">
          <Button size='sm' icon='control-loop'></Button>
          <Button size='sm' icon='control-pause'></Button>
          <Button size='sm' icon='control-play'></Button>
          <Button size='sm' icon='control-reset'></Button>
        </div>
        <header>Scrubber</header>
        <div className="panel">
          <Scrubber value={this.state.time} duration={10} onChange={(value) => { this.setState({ time: value }) }} />
        </div>
        <header>Navbar with buttons</header>
        <div className="panel">
          <Navbar icon="ui-clipboard" title="Navbar with Buttons">
            <Button icon="ui-clipboard" title="Copy" onClick={() => {
              this.setState({ time: 5 })
            }}></Button>
            <Button icon="ui-download" title="Download"></Button>
            <Button icon="animation-opacity" title={`Theme: ${this.state.theme}`} onClick={() => {
              this.setState({ theme: this.state.theme === 'dark' ? 'light' : 'dark' })
            }} />
          </Navbar>
        </div>
        <header>Navbar with icon</header>
        <div className="panel">
          <Navbar isDisabled icon="ui-clipboard" title="Navbar with Icon"></Navbar>
        </div>
        <header>Code</header>
        <div className="panel">
          <Code source={svg} language='html' indent />
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
      </Theme>
    )
  }
}

const root = createRoot(document.getElementById('root')!)
root.render(<Example />)
