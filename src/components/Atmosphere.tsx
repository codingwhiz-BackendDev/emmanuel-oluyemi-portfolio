export function Atmosphere() {
  return (
    <div className="atmosphere">
      {/* Top-left brand orb */}
      <div
        className="atmosphere-blob"
        style={{
          width: '50vw',
          height: '50vw',
          top: '-18%',
          left: '-12%',
          background: 'radial-gradient(circle, hsl(var(--brand) / 0.07), transparent 70%)',
          animation: 'atmosphere-drift-1 52s ease-in-out infinite alternate',
        }}
      />
      {/* Bottom-right soft orb */}
      <div
        className="atmosphere-blob"
        style={{
          width: '60vw',
          height: '60vw',
          bottom: '-22%',
          right: '-18%',
          background: 'radial-gradient(circle, hsl(var(--brand-light) / 0.06), transparent 70%)',
          animation: 'atmosphere-drift-2 60s ease-in-out infinite alternate',
        }}
      />
      {/* Centre subtle glow */}
      <div
        className="atmosphere-blob"
        style={{
          width: '40vw',
          height: '40vw',
          top: '38%',
          left: '28%',
          background: 'radial-gradient(circle, hsl(var(--brand-dark) / 0.04), transparent 70%)',
          animation: 'atmosphere-drift-3 44s ease-in-out infinite alternate',
        }}
      />
      <div className="atmosphere-grain" />
    </div>
  );
}
