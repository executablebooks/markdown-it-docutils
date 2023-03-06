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
  public kind = ""
  run(data: IDirectiveData<keyof BaseAdmonition["option_spec"]>): Token[] {
    const newTokens: Token[] = []

    // we create an overall container, then individual containers for the title and body
    const adToken = this.createToken("admonition_open", "aside", 1, {
      map: data.map,
      block: true,
      meta: { kind: this.kind }
    })
    if (data.options.class?.length >= 1) {
      // Custom class information must go first for styling
      // For example, `class=tip, kind=seealso` should be styled as a `tip`
      adToken.attrSet("class", data.options.class.join(" "))
      adToken.attrJoin("class", "admonition")
    } else {
      adToken.attrSet("class", "admonition")
    }
    if (this.kind) {
      adToken.attrJoin("class", this.kind)
    }
    newTokens.push(adToken)

    const adTokenTitle = this.createToken("admonition_title_open", "header", 1)
    adTokenTitle.attrSet("class", "admonition-title")
    newTokens.push(adTokenTitle)

    // we want the title to be parsed as Markdown during the inline phase
    const title = data.args.join(' ') || this.title
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
  public kind = "attention"
}

export class Caution extends BaseAdmonition {
  public title = "Caution"
  public kind = "caution"
}

export class Danger extends BaseAdmonition {
  public title = "Danger"
  public kind = "danger"
}

export class Error extends BaseAdmonition {
  public title = "Error"
  public kind = "error"
}

export class Important extends BaseAdmonition {
  public title = "Important"
  public kind = "important"
}

export class Hint extends BaseAdmonition {
  public title = "Hint"
  public kind = "hint"
}

export class Note extends BaseAdmonition {
  public title = "Note"
  public kind = "note"
}

export class SeeAlso extends BaseAdmonition {
  public title = "See Also"
  public kind = "seealso"
}

export class Tip extends BaseAdmonition {
  public title = "Tip"
  public kind = "tip"
}

export class Warning extends BaseAdmonition {
  public title = "Warning"
  public kind = "warning"
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
