import { Preview } from '@storybook/react'
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
  decorators: [(Story, { globals, parameters }) => {
    const backgroundColor: string = globals.backgrounds?.value ?? '#1e1e1e'
    const backgroundThemes: BackgroundTheme[] = parameters.backgrounds.values
    const backgroundTheme = backgroundThemes.find(({ value }) => value === backgroundColor)
    return (
      <div className={`ui-theme-${backgroundTheme?.name ?? 'light'}`}>
        <Story />
      </div>
    )
  }]
}

export default preview
