import type { Role } from "./main"

export interface IMathRoleOptions {
  renderer?: (content: string, opts: { displayMode: boolean }) => string
}

/** Allowed options for directive plugin */
export interface IOptions {
  /** Parse roles of the form `` {name}`content` `` */
  parseRoles?: boolean
  /** Core rule to run roles after (default: inline) */
  rolesAfter?: string
  /** Mapping of names to roles */
  roles?: Record<string, typeof Role>
  opts?: {
    math?: IMathRoleOptions
  }
}
