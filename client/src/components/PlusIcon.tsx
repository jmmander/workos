interface PlusIconProps {
  className?: string
}

export const PlusIcon = ({ className }: PlusIconProps) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity="0.9">
      <rect width="16" height="16" transform="translate(0.5)" fill="white" fillOpacity="0.01"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.03336 2.93336C9.03336 2.63881 8.79457 2.40002 8.50002 2.40002C8.20547 2.40002 7.96669 2.63881 7.96669 2.93336V7.46669H3.43336C3.13881 7.46669 2.90002 7.70547 2.90002 8.00002C2.90002 8.29457 3.13881 8.53336 3.43336 8.53336H7.96669V13.0667C7.96669 13.3612 8.20547 13.6 8.50002 13.6C8.79457 13.6 9.03336 13.3612 9.03336 13.0667V8.53336H13.5667C13.8612 8.53336 14.1 8.29457 14.1 8.00002C14.1 7.70547 13.8612 7.46669 13.5667 7.46669H9.03336V2.93336Z" fill="white"/>
    </g>
  </svg>
)
