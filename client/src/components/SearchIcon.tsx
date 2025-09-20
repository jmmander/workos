interface SearchIconProps {
  className?: string
}

export const SearchIcon = ({ className }: SearchIconProps) => (
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      width="16"
      height="16"
      transform="translate(0.5)"
      fill="white"
      fillOpacity="0.01"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.1666 6.9333C11.1666 8.99517 9.49517 10.6666 7.4333 10.6666C5.37143 10.6666 3.69997 8.99517 3.69997 6.9333C3.69997 4.87143 5.37143 3.19997 7.4333 3.19997C9.49517 3.19997 11.1666 4.87143 11.1666 6.9333ZM10.4294 10.6836C9.60824 11.3406 8.56665 11.7333 7.4333 11.7333C4.78234 11.7333 2.6333 9.58427 2.6333 6.9333C2.6333 4.28234 4.78234 2.1333 7.4333 2.1333C10.0843 2.1333 12.2333 4.28234 12.2333 6.9333C12.2333 8.06665 11.8406 9.10824 11.1836 9.9294L14.2105 12.9561C14.4187 13.1644 14.4187 13.5022 14.2105 13.7105C14.0022 13.9187 13.6644 13.9187 13.4561 13.7105L10.4294 10.6836Z"
      fill="#000713"
      fillOpacity="0.624"
    />
  </svg>
)
