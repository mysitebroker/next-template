import {
  LucideProps,
  Moon,
  SunMedium,
  Twitter,
  Instagram,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Activity,
  Briefcase,
  Plane,
  Building2,
  Heart,
  BarChart3,
  Shield,
  Menu,
  Info,
  Loader2,
  CreditCard,
  Check,
  Edit,
  Building,
  ScanLine,
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  instagram: Instagram,
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  users: Users,
  award: Award,
  activity: Activity,
  briefcase: Briefcase,
  travel: Plane,
  hotel: Building2,
  health: Heart,
  stats: BarChart3,
  premium: Shield,
  menu: Menu,
  info: Info,
  spinner: Loader2,
  creditCard: CreditCard,
  check: Check,
  edit: Edit,
  bank: Building,
  scan: ScanLine,
  visa: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M7 15V9l3 1 3-5 3 5v5" />
    </svg>
  ),
  mastercard: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <circle cx="9" cy="12" r="3" />
      <circle cx="15" cy="12" r="3" />
    </svg>
  ),
  amex: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M14 9l4 6m-4 0l4-6m-8 0l-4 6m4 0l-4-6" />
    </svg>
  ),
  discover: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <circle cx="15" cy="12" r="3" />
      <path d="M6 12h3" />
    </svg>
  ),
  logo: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      />
      <path
        fill="currentColor"
        d="M12.5 7.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S10.17 6 11 6s1.5.67 1.5 1.5zM12 9l-5 8h2.5l3.5-5.5L15.5 17H18l-6-8z"
      />
    </svg>
  ),
  tennis: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8 0 1.65-.5 3.18-1.36 4.45-1.8-2.97-4.96-4.9-8.64-4.9-3.7 0-6.84 1.91-8.64 4.9C2.5 15.18 2 13.65 2 12c0-4.42 3.58-8 8-8z"
      />
      <path
        fill="currentColor"
        d="M9.54 3.42c-2.73 1.02-4.72 3.41-5.32 6.32 1.32-1.13 3.55-2.19 6.48-2.19 2.93 0 5.16 1.06 6.48 2.19-.59-2.91-2.59-5.3-5.32-6.32-.38 1.14-1.24 1.98-2.32 1.98s-1.95-.84-2.32-1.98z"
      />
    </svg>
  ),
  racquet: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.5 2C9.42 2 7 4.41 7 7.5c0 1.25.38 2.4 1.03 3.35L3 17.5V21h3.5l6.67-6.67c.95.65 2.1 1.03 3.33 1.03 3.08 0 5.5-2.41 5.5-5.5 0-3.08-2.42-5.5-5.5-5.5h-4zm0 2h4c1.97 0 3.5 1.53 3.5 3.5S18.47 11 16.5 11 13 9.47 13 7.5 14.53 4 16.5 4h-4z"
      />
    </svg>
  ),
  court: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.68 4.91L6.91 5.5C8.27 3.63 10.1 4 12 4zM4 12c0-1.85.63-3.55 1.68-4.91L17.09 18.5C15.73 20.37 13.9 20 12 20c-4.42 0-8-3.58-8-8z"
      />
      <path
        fill="currentColor"
        d="M12 11v2m-5-1h10"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  ),
  jet: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"
      />
    </svg>
  ),
  nutrition: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"
      />
    </svg>
  ),
  gitHub: (props: LucideProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
}
