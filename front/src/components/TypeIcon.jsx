export default function TypeIcon({ type }) {
  if (type === 'story') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.9 6.9L22 9.6l-5.4 4.9L18.2 22 12 17.9 5.8 22l1.6-7.5L2 9.6l7.1-.7z" />
      </svg>
    );
  }
  if (type === 'task') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c3 2 5 5.5 5 9.5 0 3-1 5.5-2.5 7.5l-1-2.5h-3l-1 2.5C8 17 7 14.5 7 11.5 7 7.5 9 4 12 2z" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="13" r="6" />
    </svg>
  );
}
