import type MarkdownIt from "markdown-it/lib"
import type Renderer from "markdown-it/lib/renderer"
import type StateBlock from "markdown-it/lib/rules_block/state_block"
import { escapeHtml, unescapeAll } from "markdown-it/lib/common/utils"

// Ported from: https://github.com/executablebooks/mdit-py-plugins/blob/master/mdit_py_plugins/colon_fence.py

function _rule(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
  let haveEndMarker = false
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let maximum = state.eMarks[startLine]

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false
  }

  if (pos + 3 > maximum) {
    return false
  }

  const marker = state.src.charCodeAt(pos)

  // /* : */
  if (marker !== 0x3a) {
    return false
  }

  // scan marker length
  let mem = pos
  pos = state.skipChars(pos, marker)

  let length = pos - mem

  if (length < 3) {
    return false
  }

  const markup = state.src.slice(mem, pos)
  const params = state.src.slice(pos, maximum)

  // Since start is found, we can report success here in validation mode
  if (silent) {
    return true
  }

  // search end of block
  let nextLine = startLine

  // eslint-disable-next-line no-constant-condition
  while (true) {
    nextLine += 1
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine]
    maximum = state.eMarks[nextLine]

    if (pos < maximum && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break
    }

    if (state.src.charCodeAt(pos) != marker) {
      continue
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue
    }

    pos = state.skipChars(pos, marker)

    // closing code fence must be at least as long as the opening one
    if (pos - mem < length) {
      continue
    }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos)

    if (pos < maximum) {
      continue
    }

    haveEndMarker = true
    // found!
    break
  }
  // If a fence has heading spaces, they should be removed from its inner block
  length = state.sCount[startLine]

  state.line = nextLine + (haveEndMarker ? 1 : 0)

  const token = state.push("colon_fence", "code", 0)
  token.info = params
  token.content = state.getLines(startLine + 1, nextLine, length, true)
  token.markup = markup
  token.map = [startLine, state.line]

  return true
}

const colonFenceRender: Renderer.RenderRule = function colonFenceRender(tokens, idx) {
  const token = tokens[idx]
  const info = token.info ? unescapeAll(token.info).trim() : ""
  const content = escapeHtml(token.content)
  let block_name = ""

  if (info) {
    block_name = info.split(" ")[0]
  }
  const codeClass = block_name ? ` class="block-${block_name}"` : ""
  return `<pre><code${codeClass}>${content}</code></pre>\n`
}

/**
 * This plugin directly mimics regular fences, but with `:` colons.
 * Example:
 * ```md
 * :::name
 * contained text
 * :::
 * ```
 */
export function colonFencePlugin(md: MarkdownIt) {
  md.block.ruler.before("fence", "colon_fence", _rule, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  })
  md.renderer.rules["colon_fence"] = colonFenceRender
}
