import { SiteConfig } from "@/types/nav"

export const siteConfig: SiteConfig = {
  name: "TennisPro Portal",
  description:
    "The ultimate sports management app for professional tennis players.",
  // Public navigation items (visible to all users)
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Membership",
      href: "/#membership",
    },
    {
      title: "About",
      href: "/#about",
    },
    {
      title: "Contact",
      href: "/#contact",
    },
  ],
  // Member navigation items (visible only to logged-in users)
  memberNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Tournaments",
      href: "/tournaments",
    },
    {
      title: "Practice Courts",
      href: "/practice-courts",
    },
    {
      title: "Travel Booking",
      href: "/travel-booking",
    },
    {
      title: "Membership",
      href: "/membership",
    },
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/tennispro",
    instagram: "https://instagram.com/tennispro",
    contact: "/contact",
  },
}
