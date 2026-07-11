const PALETTES = {
  blue: {
    gradient: 'radial-gradient(circle at 35% 30%, #7fb8f2 0%, #3e8ede 55%, #2d6bb0 100%)',
  },
  orange: {
    gradient: 'radial-gradient(circle at 35% 30%, #ffd699 0%, #ffb238 55%, #d98f1f 100%)',
  },
};

export default function Planet({ color = 'blue', size = 110, style }) {
  const palette = PALETTES[color] || PALETTES.blue;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: palette.gradient,
        border: '3px solid #1e1b16',
        boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.12)',
        ...style,
      }}
    />
  );
}
