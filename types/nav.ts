export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  memberNav: NavItem[]
  links: {
    twitter: string
    instagram: string
    contact: string
  }
}
