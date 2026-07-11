import Planet from './Planet';
import Rocket from './Rocket';

const star = {
  position: 'absolute',
  clipPath:
    'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
};

export default function LoginStarfield() {
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
          top: '8%',
          left: '8%',
          width: 34,
          height: 34,
          background: '#3e8ede',
          animation: 'twinkle 3.4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          ...star,
          top: '16%',
          right: '16%',
          width: 26,
          height: 26,
          background: '#ffcb3d',
          animation: 'twinkle 4.1s ease-in-out infinite 0.5s',
        }}
      />
      <div
        style={{
          ...star,
          bottom: '20%',
          left: '14%',
          width: 22,
          height: 22,
          background: '#2ec4b6',
          animation: 'twinkle 3.7s ease-in-out infinite 1s',
        }}
      />
      <div
        style={{
          ...star,
          bottom: '12%',
          right: '10%',
          width: 30,
          height: 30,
          background: '#ff6fa5',
          animation: 'twinkle 3.2s ease-in-out infinite 1.4s',
        }}
      />
      <div
        style={{
          ...star,
          top: '44%',
          left: '5%',
          width: 18,
          height: 18,
          background: '#ff4d4d',
          animation: 'twinkle 4.4s ease-in-out infinite 0.8s',
        }}
      />

      <Planet
        color="blue"
        size={130}
        style={{
          position: 'absolute',
          top: '6%',
          right: '6%',
          animation: 'bob-slow 10s ease-in-out infinite',
        }}
      />
      <Planet
        color="orange"
        size={100}
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '5%',
          animation: 'bob-slow 12s ease-in-out infinite 1s',
        }}
      />
      <Rocket
        size={130}
        style={{
          position: 'absolute',
          bottom: '2%',
          right: '2%',
          opacity: 0.9,
          animation: 'bob-slow 13s ease-in-out infinite 0.5s',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: 'none',
          width: 60,
          height: 60,
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
