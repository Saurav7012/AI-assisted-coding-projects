export function EyeOn(){
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
        />
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
        />
    </svg>
    )
}

export function EyeOff() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.584 10.587a3.75 3.75 0 015.303 5.303M9.88 4.24A9.77 9.77 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a15.64 15.64 0 01-4.293 5.774M6.223 6.223A15.64 15.64 0 002.25 12s3.75 7.5 9.75 7.5c1.61 0 3.06-.36 4.32-.96"
      />
    </svg>
  );
}
