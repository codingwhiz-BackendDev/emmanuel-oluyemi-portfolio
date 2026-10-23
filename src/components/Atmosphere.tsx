export function Atmosphere() {
  return (
    <div className="atmosphere">
      <div
        className="atmosphere-blob"
        style={{
          width: '48vw',
          height: '48vw',
          top: '-15%',
          left: '-10%',
          background: 'hsl(0 0% 0% / 0.04)',
          animation: 'atmosphere-drift-1 48s ease-in-out infinite alternate',
        }}
      />
      <div
        className="atmosphere-blob"
        style={{
          width: '60vw',
          height: '60vw',
          bottom: '-20%',
          right: '-15%',
          background: 'hsl(0 0% 0% / 0.05)',
          animation: 'atmosphere-drift-2 55s ease-in-out infinite alternate',
        }}
      />
      <div
        className="atmosphere-blob"
        style={{
          width: '38vw',
          height: '38vw',
          top: '40%',
          left: '30%',
          background: 'hsl(0 0% 0% / 0.03)',
          animation: 'atmosphere-drift-3 40s ease-in-out infinite alternate',
        }}
      />
      <div className="atmosphere-grain" />
    </div>
  );
}
