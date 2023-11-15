export const WHITESPACES = '\n\r\t '.split('')

export const SINGLE_TOKENS = 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(',')

export interface ParserOptions {
  indentSize: number
  indentChar: string
  braceStyle: string
  maxChars: number
  unformatted: string[]
  indentScripts: 'keep' | 'separate' | 'normal'
}

export const DEFAULT_OPTIONS: ParserOptions = {
  indentSize: 2,
  indentChar: ' ',
  braceStyle: 'collapse',
  maxChars: Infinity,
  unformatted: ['a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  indentScripts: 'normal'
}

type ParserMode = 'CONTENT' | 'TAG'
type TokenType = 'TK_TAG_START' | 'TK_TAG_STYLE' | 'TK_TAG_SCRIPT' | 'TK_TAG_END' | 'TK_TAG_SINGLE' | 'TK_CONTENT' | 'TK_STYLE' | 'TK_SCRIPT' | 'TK_EOF'
type TagType = 'SINGLE' | 'SCRIPT' | 'STYLE' | 'START' | 'END'

export class Parser {
  private options: ParserOptions
  private pos = 0
  private currentMode: ParserMode = 'CONTENT'
  private tagCounts: Record<string, number> = { parent: 1 }
  private tagParents: Record<string, string> = { parent: 'parent1' }
  private tagLevels: Record<string, number> = { parent1: 0 }
  private tagParent = ''
  private tagType?: TagType
  private tokenText = ''
  private tokenType?: TokenType
  private lastToken = ''
  private lastText = ''
  private input: string
  private output: string[]
  private indentString: string
  private indentLevel: number
  private lineCharCount: number

  constructor(input: string, options: Partial<ParserOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.input = input
    this.output = []
    this.indentLevel = 0
    this.lineCharCount = 0
    this.indentString = ''
    for (let i = 0; i < this.options.indentSize; i++) {
      this.indentString += this.options.indentChar
    }
  }

  private getContent() {
    let inputChar = ''
    const content = []
    let space = false // if a space is needed

    while (this.input.charAt(this.pos) !== '<') {
      if (this.pos >= this.input.length) {
        return content.length ? content.join('') : ['', 'TK_EOF']
      }

      inputChar = this.input.charAt(this.pos)
      this.pos++
      this.lineCharCount++

      if (WHITESPACES.includes(inputChar)) {
        if (content.length) { space = true }
        this.lineCharCount--
        continue //don't want to insert unnecessary space
      } else if (space) {
        if (this.lineCharCount >= this.options.maxChars) { //insert a line when the maxChars is reached
          content.push('\n')
          for (let i = 0; i < this.indentLevel; i++) {
            content.push(this.indentString)
          }
          this.lineCharCount = 0
        } else {
          content.push(' ')
          this.lineCharCount++
        }
        space = false
      }
      content.push(inputChar) //letter at-a-time (or string) inserted to an array
    }
    return content.length ? content.join('') : ''
  }

  private getContentsTo(name: string) {
    if (this.pos === this.input.length) { return ['', 'TK_EOF'] }
    let content = ''
    const regMatch = new RegExp('</' + name + '\\s*>', 'igm')
    regMatch.lastIndex = this.pos
    const regArray = regMatch.exec(this.input)
    const endScript = regArray ? regArray.index : this.input.length //absolute end of script
    if (this.pos < endScript) { //get everything in between the script tags
      content = this.input.substring(this.pos, endScript)
      this.pos = endScript
    }
    return content
  }

  private recordTag(tag: string) {
    this.tagCounts[tag] = (this.tagCounts[tag] ?? 0) + 1
    this.tagLevels[tag + this.tagCounts[tag]] = this.indentLevel
    this.tagParents[tag + this.tagCounts[tag]] = this.tagParent
    this.tagParent = tag + this.tagCounts[tag]
  }

  retrieveTag(tag: string) {
    if (!this.tagCounts[tag]) { return }
    let tempParent = this.tagParent //check to see if it's a closable tag.
    while (tempParent) { //till we reach '' (the initial value);
      //if this is it use it
      if (tag + this.tagCounts[tag] === tempParent) { break }
      //otherwise keep on climbing up the DOM Tree
      tempParent = this.tagParents[tempParent]
    }
    //if we caught something
    if (tempParent) {
      // set the indent_level accordingly
      this.indentLevel = this.tagLevels[tag + this.tagCounts[tag]]
      this.tagParent = this.tagParents[tempParent] // and set the current parent
    }
    // delete the closed tags parent reference...
    delete this.tagParents[tag + this.tagCounts[tag]]
    delete this.tagLevels[tag + this.tagCounts[tag]]
    if (this.tagCounts[tag] === 1) {
      delete this.tagCounts[tag]
    } else {
      this.tagCounts[tag]--
    }
  }

  private getTag() {
    let inputChar = ''
    const content = []
    let space = false
    let tagStart = 0
    let tagEnd

    do {
      if (this.pos >= this.input.length) {
        return content.length ? content.join('') : ['', 'TK_EOF']
      }

      inputChar = this.input.charAt(this.pos)
      this.pos++
      this.lineCharCount++

      // don't want to insert unnecessary space
      if (WHITESPACES.includes(inputChar)) {
        space = true
        this.lineCharCount--
        continue
      }

      if (inputChar === '\'' || inputChar === '"') {
        if (!content[1] || content[1] !== '!') {
          inputChar += this.getUnformatted(inputChar)
          space = true
        }
      }

      //no space before =
      if (inputChar === '=') { space = false }

      if (content.length && content[content.length - 1] !== '=' && inputChar !== '>' && space) {
        // no space after = or before >
        if (this.lineCharCount >= this.options.maxChars) {
          this.printNewline(false, content)
          this.lineCharCount = 0
        } else {
          content.push(' ')
          this.lineCharCount++
        }
        space = false
      }
      if (inputChar === '<') { tagStart = this.pos - 1 }
      // inserts character at-a-time (or string)
      content.push(inputChar)
    } while (inputChar !== '>')

    const tagComplete = content.join('')
    const tagIndex = (tagComplete.indexOf(' ') !== -1) ? tagComplete.indexOf(' ') : tagComplete.indexOf('>')
    const tagCheck = tagComplete.substring(1, tagIndex).toLowerCase()
    // if this tag name is a single tag type (either in the list or has a closing /)
    if (
      tagComplete.charAt(tagComplete.length - 2) === '/' ||
      SINGLE_TOKENS.includes(tagCheck)
    ) {
      this.tagType = 'SINGLE'
    } else if (tagCheck === 'script') { //for later script handling
      this.recordTag(tagCheck)
      this.tagType = 'SCRIPT'
    } else if (tagCheck === 'style') { //for future style handling (for now it justs uses getContent)
      this.recordTag(tagCheck)
      this.tagType = 'STYLE'
    } else if (this.options.unformatted.includes(tagCheck)) {
      // do not reformat the "unformatted" tags
      const comment = this.getUnformatted('</' + tagCheck + '>', tagComplete) //...delegate to getUnformatted function
      content.push(comment)
      // Preserve collapsed whitespace either before or after this tag.
      if (tagStart > 0 && WHITESPACES.includes(this.input.charAt(tagStart - 1))) {
        content.splice(0, 0, this.input.charAt(tagStart - 1))
      }
      tagEnd = this.pos - 1
      if (WHITESPACES.includes(this.input.charAt(tagEnd + 1))) {
        content.push(this.input.charAt(tagEnd + 1))
      }
      this.tagType = 'SINGLE'
    } else if (tagCheck.charAt(0) === '!') { //peek for <!-- comment
      if (tagCheck.indexOf('[if') !== -1) { //peek for <!--[if conditional comment
        if (tagComplete.indexOf('!IE') !== -1) { //this type needs a closing --> so...
          const comment = this.getUnformatted('-->', tagComplete) //...delegate to getUnformatted
          content.push(comment)
        }
        this.tagType = 'START'
      } else if (tagCheck.indexOf('[endif') !== -1) { //peek for <!--[endif end conditional comment
        this.tagType = 'END'
        this.unindent()
      } else if (tagCheck.indexOf('[cdata[') !== -1) { //if it's a <[cdata[ comment...
        const comment = this.getUnformatted(']]>', tagComplete) //...delegate to getUnformatted function
        content.push(comment)
        this.tagType = 'SINGLE' //<![CDATA[ comments are treated like single tags
      } else {
        const comment = this.getUnformatted('-->', tagComplete)
        content.push(comment)
        this.tagType = 'SINGLE'
      }
    } else {
      if (tagCheck.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
        this.retrieveTag(tagCheck.substring(1)) //remove it and all ancestors
        this.tagType = 'END'
      } else { //otherwise it's a start-tag
        this.recordTag(tagCheck) //push it on the tag stack
        this.tagType = 'START'
      }
    }
    return content.join('') //returns fully formatted tag
  }

  // function to return unformatted content in its entirety
  private getUnformatted(delimiter: string, origTag?: string) {
    if (origTag && origTag.toLowerCase().indexOf(delimiter) !== -1) { return '' }
    let inputChar = ''
    let content = ''
    let space = true

    // data lookahead
    if (this.input.substring(this.pos, this.pos + 5) === 'data:') {
      const endPos = this.input.indexOf(delimiter, this.pos)
      const result = this.input.substring(this.pos, endPos)
      this.lineCharCount += result.length
      this.pos += result.length
      content = result
    }

    do {
      if (this.pos >= this.input.length) { return content }

      inputChar = this.input.charAt(this.pos)
      this.pos++

      if (WHITESPACES.includes(inputChar)) {
        if (!space) {
          this.lineCharCount--
          continue
        }
        if (inputChar === '\n' || inputChar === '\r') {
          content += '\n'
          this.lineCharCount = 0
          continue
        }
      }

      content += inputChar
      this.lineCharCount++
      space = true
    } while (content.toLowerCase().indexOf(delimiter) === -1)
    return content
  }

  private getToken() {
    let token

    if (this.lastToken === 'TK_TAG_SCRIPT' || this.lastToken === 'TK_TAG_STYLE') { //check if we need to format javascript
      const type = this.lastToken.substring(7)
      token = this.getContentsTo(type)
      return (typeof token !== 'string') ? token : [token, 'TK_' + type]
    }

    if (this.currentMode === 'CONTENT') {
      token = this.getContent()
      return (typeof token !== 'string') ? token : [token, 'TK_CONTENT']
    }

    if (this.currentMode === 'TAG') {
      token = this.getTag()
      return (typeof token !== 'string') ? token : [token, `TK_TAG_${this.tagType}`]
    }
  }

  private getFullIndent(level: number) {
    level = this.indentLevel + level || 0
    if (level < 1) { return '' }
    return Array(level + 1).join(this.indentString)
  }

  private printNewline(ignore: boolean, arr: string[]) {
    this.lineCharCount = 0
    if (!arr?.length) { return }
    if (!ignore) {
      while (WHITESPACES.includes(arr[arr.length - 1])) {
        arr.pop()
      }
    }
    arr.push('\n')
    for (let i = 0; i < this.indentLevel; i++) {
      arr.push(this.indentString)
    }
  }

  private printToken(text: string) {
    this.output.push(text)
  }

  private indent() {
    this.indentLevel++
  }

  private unindent() {
    if (this.indentLevel > 0) { this.indentLevel-- }
  }

  public process() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const t = this.getToken()!
      this.tokenText = t[0]
      this.tokenType = t[1] as TokenType
      if (this.tokenType === 'TK_EOF') { break }

      switch (this.tokenType) {
        case 'TK_TAG_START':
          this.printNewline(false, this.output)
          this.printToken(this.tokenText)
          this.indent()
          this.currentMode = 'CONTENT'
          break
        case 'TK_TAG_STYLE':
        case 'TK_TAG_SCRIPT':
          this.printNewline(false, this.output)
          this.printToken(this.tokenText)
          this.currentMode = 'CONTENT'
          break
        case 'TK_TAG_END':
          // Print new line only if the tag has no content and has child
          if (this.lastToken === 'TK_CONTENT' && this.lastText === '') {
            const tagName = this.tokenText.match(/\w+/)![0]
            const tagExtractedFromLastOutput = this.output[this.output.length - 1].match(/<\s*(\w+)/)
            if (tagExtractedFromLastOutput === null || tagExtractedFromLastOutput[1] !== tagName) {
              this.printNewline(true, this.output)
            }
          }
          this.printToken(this.tokenText)
          this.currentMode = 'CONTENT'
          break
        case 'TK_TAG_SINGLE': {
          // Don't add a newline before elements that should remain unformatted.
          const tagCheck = this.tokenText.match(/^\s*<([a-z]+)/i)
          if (!tagCheck || !this.options.unformatted.includes(tagCheck[1])) {
            this.printNewline(false, this.output)
          }
          this.printToken(this.tokenText)
          this.currentMode = 'CONTENT'
          break
        }
        case 'TK_CONTENT':
          if (this.tokenText !== '') { this.printToken(this.tokenText) }
          this.currentMode = 'TAG'
          break
        case 'TK_STYLE':
        case 'TK_SCRIPT':
          if (this.tokenText !== '') {
            this.output.push('\n')
            let text = this.tokenText
            let scriptIndentLevel: number

            if (this.options.indentScripts === 'keep') {
              scriptIndentLevel = 0
            } else if (this.options.indentScripts === 'separate') {
              scriptIndentLevel = -this.indentLevel
            } else {
              scriptIndentLevel = 1
            }

            const indentation = this.getFullIndent(scriptIndentLevel)

            // simply indent the string otherwise
            const white = text.match(/^\s*/)![0]
            const level = white.match(/[^\n\r]*$/)![0].split(this.indentString).length - 1
            const reindent = this.getFullIndent(scriptIndentLevel - level)
            text = text.replace(/^\s*/, indentation)
              .replace(/\r\n|\r|\n/g, '\n' + reindent)
              .replace(/\s*$/, '')

            if (text) {
              this.printToken(text)
              this.printNewline(true, this.output)
            }
          }
          this.currentMode = 'TAG'
          break
      }
      this.lastToken = this.tokenType!
      this.lastText = this.tokenText
    }
    return this.output.join('')
  }
}

export function prettyPrint(source: string, options: Partial<ParserOptions> = {}) {
  const parser = new Parser(source, options)
  return parser.process()
}
