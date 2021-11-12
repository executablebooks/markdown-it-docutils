export { Role, main } from "./main"
export { default as rolePlugin } from "./plugin"
export type { IOptions as IRoleOptions } from "./types"
export { math } from "./math"

import { main } from "./main"
import { math } from "./math"
import { html } from "./html"

export const rolesDefault = { ...main, ...html, ...math }
