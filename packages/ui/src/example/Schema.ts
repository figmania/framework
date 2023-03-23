import { CreateSchema, TreeNode } from '@figmania/common'

export interface Config {
  theme: 'dark' | 'light'
  size: 'sm' | 'md'
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
