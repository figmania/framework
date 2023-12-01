import { Preview } from '@storybook/react'
import { PluginWindow } from './components/PluginWindow'
import './preview.scss'

interface BackgroundTheme {
  name: 'light' | 'dark'
  value: string
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1e1e1e' },
        { name: 'midnight', value: '#2e3440' },
        { name: 'light', value: '#f5f5f5' }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [(Story, { globals, parameters, title }) => {
    const backgroundColor: string = globals.backgrounds?.value ?? '#1e1e1e'
    const backgroundThemes: BackgroundTheme[] = parameters.backgrounds.values
    const backgroundTheme = backgroundThemes.find(({ value }) => value === backgroundColor)
    return (
      <PluginWindow title={title} theme={backgroundTheme?.name} padding={parameters.padding}>
        <Story />
      </PluginWindow>
    )
  }]
}

export default preview
