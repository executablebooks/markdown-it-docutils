export { Role, main, IRoleData } from "./main"
export { default as rolePlugin } from "./plugin"
export type { IOptions as IRoleOptions } from "./types"
export { math } from "./math"
export { html } from "./html"
export { references } from "./references"

import { main } from "./main"
import { math } from "./math"
import { html } from "./html"
import { references } from "./references"

export const rolesDefault = { ...main, ...html, ...math, ...references }
