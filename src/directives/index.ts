export { Directive } from "./main"
export { default as directivePlugin } from "./plugin"
export type { IOptions as IDirectiveOptions } from "./types"

export { admonitions } from "./admonitions"
export { code } from "./code"
export { images } from "./images"
export { tables } from "./tables"
export { math } from "./math"

import { admonitions } from "./admonitions"
import { code } from "./code"
import { images } from "./images"
import { tables } from "./tables"
import { math } from "./math"

export const directivesDefault = {
  ...admonitions,
  ...images,
  ...code,
  ...tables,
  ...math
}
