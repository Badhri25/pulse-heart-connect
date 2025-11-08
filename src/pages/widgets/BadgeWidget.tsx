const BadgeWidget = () => {
  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      color: '#0f172a',
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 999,
      border: '1px solid rgba(148,163,184,0.35)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
    }}>
      <span role="img" aria-label="sparkles" style={{fontSize: 16}}>✨</span>
      <span style={{fontSize: 13, color: '#475569'}}>Connected on</span>
      <strong style={{fontSize: 14}}>PulsePod</strong>
    </div>
  );
};

export default BadgeWidget;
