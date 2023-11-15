/* eslint-disable @typescript-eslint/no-explicit-any */
export type SchemaDef = {
  events?: { name: string; data: unknown }
  requests?: { name: string; data: [unknown, unknown] }
}

export type CreateSchema<Schema extends SchemaDef = any> = {
  events: Schema['events'] extends EventData ? { [S in Schema['events']as S['name']]: S['data'] } : never
  request: Schema['requests'] extends RequestData ? { [S in Schema['requests']as S['name']]: S['data'] } : never
}

export type EventData = { name: string; data: unknown }

export type RequestData = { name: string; data: [unknown, unknown] }
