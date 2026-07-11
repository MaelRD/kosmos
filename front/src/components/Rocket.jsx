export default function Rocket({ size = 120, style }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      style={style}
    >
      <path
        d="M50 4 C70 26 78 58 74 92 L26 92 C22 58 30 26 50 4 Z"
        fill="#ffcb3d"
        stroke="#1e1b16"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M26 70 C10 74 4 92 4 108 C16 100 24 92 30 84 Z"
        fill="#ff6fa5"
        stroke="#1e1b16"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M74 70 C90 74 96 92 96 108 C84 100 76 92 70 84 Z"
        fill="#ff6fa5"
        stroke="#1e1b16"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="46" r="14" fill="#3e8ede" stroke="#1e1b16" strokeWidth="4" />
      <path
        d="M38 92 C40 108 44 120 50 128 C56 120 60 108 62 92 Z"
        fill="#ffb238"
        stroke="#1e1b16"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
