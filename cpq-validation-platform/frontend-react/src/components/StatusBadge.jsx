const colors = {
  PENDING: '#e2e8f0',
  IN_PROGRESS: '#fcd34d',
  PASSED: '#22c55e',
  FAILED: '#ef4444',
};

function StatusBadge({ status = 'PENDING' }) {
  const color = colors[status] || '#e2e8f0';
  return (
    <span
      style={{
        background: color,
        color: '#0f172a',
        borderRadius: '12px',
        padding: '4px 10px',
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
