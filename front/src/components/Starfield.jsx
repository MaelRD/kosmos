import Planet from './Planet';

const star = {
  position: 'absolute',
  clipPath:
    'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
};

export default function Starfield() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          ...star,
          top: '10%',
          left: '6%',
          width: 26,
          height: 26,
          background: '#3e8ede',
          animation: 'twinkle 3.4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          ...star,
          top: '6%',
          right: '22%',
          width: 20,
          height: 20,
          background: '#ffcb3d',
          animation: 'twinkle 4.1s ease-in-out infinite 0.5s',
        }}
      />
      <div
        style={{
          ...star,
          bottom: '8%',
          left: '16%',
          width: 18,
          height: 18,
          background: '#2ec4b6',
          animation: 'twinkle 3.7s ease-in-out infinite 1s',
        }}
      />
      <div
        style={{
          ...star,
          top: '40%',
          right: '4%',
          width: 22,
          height: 22,
          background: '#ff6fa5',
          animation: 'twinkle 3.2s ease-in-out infinite 1.4s',
        }}
      />

      <Planet
        color="blue"
        size={110}
        style={{
          position: 'absolute',
          top: 70,
          right: 60,
          opacity: 0.9,
          animation: 'bob-slow 11s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 5,
          pointerEvents: 'none',
          width: 56,
          height: 56,
          animation: 'drift-across 36s linear infinite',
        }}
      >
        <img
          src="/assets/mascot-crayon-helmet.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
