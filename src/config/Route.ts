type PermissionName = string
type IconSvgFile = string

export interface RouteMeta {
  title: string
  keepAlive: boolean
  icon: string | IconSvgFile
  permission: PermissionName[]
}
