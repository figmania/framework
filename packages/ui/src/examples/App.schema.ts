import { CreateSchema, TreeNode } from '@figmania/common'
import { ThemeSize, ThemeType } from '../components/PluginUI/PluginUI'

export interface Config {
  theme: ThemeType
  size: ThemeSize
}

export type Schema = CreateSchema<{
  requests: {
    name: 'ping'
    data: [string, string]
  }
  events: {
    name: 'node:select'
    data: TreeNode | undefined
  } | {
    name: 'test:message'
    data: string
  }
}>
