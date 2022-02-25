/** Directives for creating tables */
import type Token from "markdown-it/lib/token"
import { SyntaxTreeNode } from "../syntaxTree"
import { Directive, DirectiveParsingError, IDirectiveData } from "./main"
import {
  class_option,
  create_choice,
  length_or_percentage_or_unitless,
  nonnegative_int,
  unchanged
} from "./options"

export class ListTable extends Directive {
  public required_arguments = 0
  public optional_arguments = 1
  public final_argument_whitespace = true
  public has_content = true
  public option_spec = {
    "header-rows": nonnegative_int,
    "stub-columns": nonnegative_int,
    width: length_or_percentage_or_unitless,
    widths: unchanged, // TODO use correct widths option validator
    class: class_option,
    name: unchanged,
    align: create_choice(["left", "center", "right"])
  }
  run(data: IDirectiveData): Token[] {
    // TODO support all options (add colgroup for widths)
    // Parse content
    this.assert_has_content(data)
    const headerRows = (data.options["header-rows"] || 0) as number
    const listTokens = this.nestedParse(data.body, data.bodyMap[0])
    // Check content is a list
    if (
      listTokens.length < 2 ||
      listTokens[0].type !== "bullet_list_open" ||
      listTokens[listTokens.length - 1].type !== "bullet_list_close"
    ) {
      throw new DirectiveParsingError("Content is not a single bullet list")
    }

    // generate tokens
    const tokens: Token[] = []

    // table opening
    const tableOpen = this.createToken("table_open", "table", 1, { map: data.bodyMap })
    if (data.options.align) {
      tableOpen.attrJoin("class", `align-${data.options.align}`)
    }
    if (data.options.class) {
      tableOpen.attrJoin("class", data.options.class.join(" "))
    }
    tokens.push(tableOpen)

    // add caption
    if (data.args.length && data.args[0]) {
      tokens.push(this.createToken("table_caption_open", "caption", 1))
      tokens.push(
        this.createToken("inline", "", 0, {
          map: [data.map[0], data.map[0]],
          content: data.args[0],
          children: []
        })
      )
      tokens.push(this.createToken("table_caption_close", "caption", -1))
    }

    let colType: "th" | "td" = "th"
    if (headerRows) {
      tokens.push(this.createToken("thead_open", "thead", 1, { level: 1 }))
      colType = "th"
    } else {
      tokens.push(this.createToken("tbody_open", "tbody", 1, { level: 1 }))
      colType = "td"
    }

    let rowLength: number | undefined = undefined
    let rowNumber = 0
    for (const child of new SyntaxTreeNode(listTokens.slice(1, -1)).children) {
      rowNumber += 1
      this.assert(
        child.type === "list_item",
        `list item ${rowNumber} not of type 'list_item': ${child.type}`
      )
      this.assert(
        child.children.length === 1 && child.children[0].type === "bullet_list",
        `list item ${rowNumber} content not a nested bullet list`
      )
      const row = child.children[0].children
      if (rowLength === undefined) {
        rowLength = row.length
      } else {
        this.assert(
          row.length === rowLength,
          `list item ${rowNumber} does not contain the same number of columns as previous items`
        )
      }
      if (headerRows && rowNumber === headerRows + 1) {
        tokens.push(this.createToken("thead_close", "thead", -1, { level: 1 }))
        tokens.push(this.createToken("tbody_open", "tbody", 1, { level: 1 }))
        colType = "td"
      }
      tokens.push(this.createToken("tr_open", "tr", 1, { map: child.map, level: 2 }))
      for (const column of row) {
        tokens.push(
          this.createToken(`${colType}_open`, colType, 1, { map: column.map, level: 3 })
        )
        // TODO if the list is not tight then all paragraphs will be un-hidden maybe we don't want this?
        tokens.push(...column.to_tokens().slice(1, -1))
        tokens.push(this.createToken(`${colType}_close`, colType, -1, { level: 3 }))
      }
      tokens.push(this.createToken("tr_close", "tr", -1, { level: 2 }))
    }

    if (headerRows && rowNumber < headerRows) {
      throw new Error(
        `Insufficient rows (${rowNumber}) for required header rows (${headerRows})`
      )
    }

    // closing tokens
    if (colType === "td") {
      tokens.push(this.createToken("tbody_close", "tbody", -1, { level: 1 }))
    } else {
      tokens.push(this.createToken("thead_close", "thead", -1, { level: 1 }))
    }
    tokens.push(this.createToken("table_close", "table", -1))

    return tokens
  }
}

export const tables = {
  "list-table": ListTable
}
