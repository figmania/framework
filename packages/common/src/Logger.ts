import { Logger as BaseLogger } from 'tslog'

export enum LogLevel { SILLY, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, EVENT, REQUEST, RESPONSE }

export interface FigmaLoggerOptions {
  name: string
  minLevel: LogLevel
  date: boolean
}

export class FigmaLogger extends BaseLogger<unknown> {
  constructor({ name, minLevel, date }: FigmaLoggerOptions) {
    super({
      name,
      minLevel,
      type: 'pretty',
      hideLogPositionForProduction: true,
      prettyLogTimeZone: 'local',
      prettyErrorLoggerNameDelimiter: ':',
      prettyLogTemplate: `${date ? '{{hh}}:{{MM}}:{{ss}} ' : ''}{{nameWithDelimiterSuffix}}{{logLevelName}} `,
      prettyLogStyles: {
        name: ['blackBright', 'bold'],
        nameWithDelimiterPrefix: ['blackBright', 'bold'],
        nameWithDelimiterSuffix: ['blackBright', 'bold'],
        logLevelName: {
          '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
          SILLY: ['bold', 'white'],
          TRACE: ['bold', 'whiteBright'],
          DEBUG: ['bold', 'green'],
          INFO: ['bold', 'blue'],
          WARN: ['bold', 'yellow'],
          ERROR: ['bold', 'red'],
          FATAL: ['bold', 'redBright'],
          EVENT: ['bold', 'green'],
          REQUEST: ['bold', 'blueBright'],
          RESPONSE: ['bold', 'blue']
        }
      }
    })
  }

  public event(...args: unknown[]) {
    return super.log(LogLevel.EVENT, 'EVENT', ...args)
  }

  public request(...args: unknown[]) {
    return super.log(LogLevel.REQUEST, 'REQUEST', ...args)
  }

  public response(...args: unknown[]) {
    return super.log(LogLevel.RESPONSE, 'RESPONSE', ...args)
  }
}
