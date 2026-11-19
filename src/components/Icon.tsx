import type { SVGProps } from 'react'

export type IconName =
  | 'search'
  | 'chevron-down'
  | 'chevron-right'
  | 'close'
  | 'arrow-up-right'
  | 'filter'
  | 'grid'
  | 'list'
  | 'layers'
  | 'alert'
  | 'calendar'
  | 'external'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
  label?: string
}

const paths: Record<IconName, JSX.Element> = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'arrow-up-right': <path d="M6 18 18 6M9 6h9v9" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  list: <path d="M5 6h1M10 6h9M5 12h1M10 12h9M5 18h1M10 18h9" />,
  layers: <path d="m4 8 8-4 8 4-8 4-8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />,
  alert: <><path d="M12 4 21 20H3L12 4Z" /><path d="M12 9v5M12 17h.01" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
}

export function Icon({ name, size = 18, label, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
