/* eslint-disable @typescript-eslint/no-explicit-any */
/** Convert a directives first line and content to its structural components
 *
 * The code is adapted from: myst_parser/parse_directives.py
 * and is common for all directives
 */

import yaml from "js-yaml"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import type Token from "markdown-it/lib/token"
import { OptionSpecConverter } from "./directiveOptions"
import { nestedCoreParse } from "../nestedCoreParse"

/** token specification for a directive */
export class DirectiveToken implements Token {
  public type = "directive"
  public tag = ""
  public attrs = null
  public nesting = 0 as 1 | 0 | -1
  public level = 0
  public children = null
  public markup = ""
  public block = true
  public hidden = false
  public info: string
  public meta: { arg: string }
  public content: string
  public map: [number, number]
  constructor(name: string, arg: string, content: string, map: [number, number]) {
    this.info = name
    this.meta = { arg }
    this.content = content
    this.map = map
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attrIndex(name: string): number {
    return -1
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attrPush(attrData: [string, string]): void {
    throw new Error("not implemented")
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attrSet(name: string, value: string): void {
    throw new Error("not implemented")
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attrGet(name: string): null {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attrJoin(name: string, value: string): void {
    throw new Error("not implemented")
  }
}

/** Data required to parse a directive first line and content to its structure */
export interface IDirectiveSpec {
  /** number of required arguments */
  required_arguments?: number
  /** number of optional arguments */
  optional_arguments?: number
  /** indicating if the final argument may contain whitespace */
  final_argument_whitespace?: boolean
  /** if body content is allowed */
  has_content?: boolean
  /** mapping known option names to conversion functions */
  option_spec?: {
    [key: string]: OptionSpecConverter
  }
}

export class Directive implements IDirectiveSpec {
  public required_arguments = 0
  public optional_arguments = 0
  public final_argument_whitespace = false
  public has_content = false
  public option_spec = {}
  public state: StateCore
  constructor(state: StateCore) {
    this.state = state
  }
  /** Convert the directive data to tokens */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(data: IDirectiveData): Token[] {
    return []
  }
  /** parse block of text to tokens (does not run inline parse) */
  nestedParse(block: string, initLine: number): Token[] {
    return nestedCoreParse(
      this.state.md,
      "run_directives",
      block,
      this.state.env,
      initLine,
      true
    )
  }
}

/** Data structure of a directive */
export interface IDirectiveData {
  map: [number, number]
  args: string[]
  options: { [key: string]: any }
  body: string
  /** line that body content starts on, relative to start of directive */
  bodyOffset: number
}

/** Raise on parsing/validation error. */
export class DirectiveParsingError extends Error {
  name = "DirectiveParsingError"
}

/**
 * This function contains the logic to take the first line of a directive,
 * and the content, and turn it into the three core components:
 * arguments (list), options (key: value mapping), and body (text).
 */
export default function directiveToData(
  token: Token,
  directive: IDirectiveSpec,
  /** Do not validate/convert option values */
  skipValidation?: boolean
): IDirectiveData {
  const firstLine = token.meta.arg || ""
  const content = token.content
  let body = content.trim() ? content.split(/\r?\n/) : []
  let bodyOffset = 0
  let options = {}
  if (Object.keys(directive.option_spec || {})) {
    ;[body, options, bodyOffset] = parseDirectiveOptions(
      body,
      directive,
      !skipValidation
    )
  }
  let args: string[] = []
  if (
    !directive.required_arguments &&
    !directive.optional_arguments &&
    !Object.keys(options).length
  ) {
    if (firstLine) {
      bodyOffset = 0
      body = [firstLine].concat(body)
    }
  } else {
    args = parseDirectiveArguments(firstLine, directive)
  }
  // remove first line of body if blank, to allow space between the options and the content
  if (body.length && !body[0].trim()) {
    body.shift()
  }
  // check for body content
  if (body.length && !directive.has_content) {
    throw new DirectiveParsingError("Has content but content not allowed")
  }
  return {
    map: token.map ? token.map : [0, 0],
    args,
    options,
    body: body.join("\n"),
    bodyOffset
  }
}

function parseDirectiveOptions(
  content: string[],
  fullSpec: IDirectiveSpec,
  validate: boolean
): [string[], { [key: string]: any }, number] {
  // instantiate options
  let bodyOffset = 1
  let options: { [key: string]: any } = {}
  let yamlBlock: null | string[] = null

  // TODO allow for indented content (I can't remember why this was needed?)

  if (content.length && content[0].startsWith("---")) {
    // options contained in YAML block, ending with '---'
    bodyOffset++
    const newContent: string[] = []
    yamlBlock = []
    let foundDivider = false
    for (const line of content.slice(1)) {
      if (line.startsWith("---")) {
        bodyOffset++
        foundDivider = true
        continue
      }
      if (foundDivider) {
        newContent.push(line)
      } else {
        bodyOffset++
        yamlBlock.push(line)
      }
    }
    content = newContent
  } else if (content.length && content[0].startsWith(":")) {
    bodyOffset++
    const newContent: string[] = []
    yamlBlock = []
    let foundDivider = false
    for (const line of content) {
      if (!foundDivider && !line.startsWith(":")) {
        bodyOffset++
        foundDivider = true
        continue
      }
      if (foundDivider) {
        newContent.push(line)
      } else {
        bodyOffset++
        yamlBlock.push(line.slice(1))
      }
    }
    content = newContent
  }

  if (yamlBlock !== null) {
    try {
      const output = yaml.load(yamlBlock.join("\n"))
      if (output !== null && typeof output === "object") {
        options = output
      } else {
        throw new DirectiveParsingError(`not dict: ${output}`)
      }
    } catch (error) {
      throw new DirectiveParsingError(`Invalid options YAML: ${error}`)
    }
  }

  if (!validate) {
    return [content, options, bodyOffset]
  }

  for (const [name, value] of Object.entries(options)) {
    const convertor = fullSpec.option_spec ? fullSpec.option_spec[name] : null
    if (!convertor) {
      throw new DirectiveParsingError(`Unknown option: ${name}`)
    }
    let converted_value = value
    if (value === null || value === false) {
      converted_value = ""
    }
    try {
      converted_value = convertor(`${converted_value}`)
    } catch (error) {
      throw new DirectiveParsingError(
        `Invalid option value: (option: '${name}'; value: ${value})\n${error}`
      )
    }
    options[name] = converted_value
  }

  return [content, options, bodyOffset]
}

function parseDirectiveArguments(
  firstLine: string,
  fullSpec: IDirectiveSpec
): string[] {
  let args = firstLine.trim() ? firstLine.trim()?.split(/\s+/) : []
  const totalArgs =
    (fullSpec.required_arguments || 0) + (fullSpec.optional_arguments || 0)
  if (args.length < (fullSpec.required_arguments || 0)) {
    throw new DirectiveParsingError(
      `${fullSpec.required_arguments} argument(s) required, ${args.length} supplied`
    )
  } else if (args.length > totalArgs) {
    if (fullSpec.final_argument_whitespace) {
      // note split limit does not work the same as in python
      const arr = firstLine.split(/\s+/)
      args = arr.splice(0, totalArgs - 1)
      // TODO is it ok that we effectively replace all whitespace with single spaces?
      args.push(arr.join(" "))
    } else {
      throw new DirectiveParsingError(
        `maximum ${totalArgs} argument(s) allowed, ${args.length} supplied`
      )
    }
  }
  return args
}
