/** Directives for creating admonitions, also known as call-outs,
 * for including side content without significantly interrupting the document flow.
 */
import type Token from "markdown-it/lib/token"
import { class_option, unchanged } from "./options"
import { Directive, IDirectiveData } from "./main"

/** Directives for admonition boxes.
 *
 * Apdapted from: docutils/docutils/parsers/rst/directives/admonitions.py
 */
class BaseAdmonition extends Directive {
  public final_argument_whitespace = true
  public has_content = true
  public option_spec = {
    class: class_option,
    // TODO handle name option
    name: unchanged
  }
  public title = ""
  run(data: IDirectiveData<keyof BaseAdmonition["option_spec"]>): Token[] {
    const newTokens: Token[] = []

    // we create an overall container, then individual containers for the title and body

    const adToken = this.createToken("admonition_open", "aside", 1, {
      map: data.map,
      block: true
    })
    adToken.attrSet("class", "admonition")
    if (this.title)
      adToken.attrJoin("class", this.title.toLowerCase().replace(/ /g, ""))
    if (data.options.class) {
      adToken.attrJoin("class", data.options.class.join(" "))
    }
    newTokens.push(adToken)

    const adTokenTitle = this.createToken("admonition_title_open", "header", 1)
    adTokenTitle.attrSet("class", "admonition-title")
    newTokens.push(adTokenTitle)

    // we want the title to be parsed as Markdown during the inline phase
    const title = data.args[0] || this.title
    newTokens.push(
      this.createToken("inline", "", 0, {
        map: [data.map[0], data.map[0]],
        content: title,
        children: []
      })
    )

    newTokens.push(
      this.createToken("admonition_title_close", "header", -1, { block: true })
    )

    // run a recursive parse on the content of the admonition upto this stage
    const bodyTokens = this.nestedParse(data.body, data.bodyMap[0])
    newTokens.push(...bodyTokens)

    newTokens.push(this.createToken("admonition_close", "aside", -1, { block: true }))

    return newTokens
  }
}

export class Admonition extends BaseAdmonition {
  public required_arguments = 1
}

export class Attention extends BaseAdmonition {
  public title = "Attention"
}

export class Caution extends BaseAdmonition {
  public title = "Caution"
}

export class Danger extends BaseAdmonition {
  public title = "Danger"
}

export class Error extends BaseAdmonition {
  public title = "Error"
}

export class Important extends BaseAdmonition {
  public title = "Important"
}

export class Hint extends BaseAdmonition {
  public title = "Hint"
}

export class Note extends BaseAdmonition {
  public title = "Note"
}

export class SeeAlso extends BaseAdmonition {
  public title = "See Also"
}

export class Tip extends BaseAdmonition {
  public title = "Tip"
}

export class Warning extends BaseAdmonition {
  public title = "Warning"
}

export const admonitions = {
  admonition: Admonition,
  attention: Attention,
  caution: Caution,
  danger: Danger,
  error: Error,
  important: Important,
  hint: Hint,
  note: Note,
  seealso: SeeAlso,
  tip: Tip,
  warning: Warning
}
