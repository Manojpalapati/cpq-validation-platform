/**
 * Landing Page Component
 * Main entry point for the Order Validation Platform
 */
function LandingPage({ onNavigate }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
      padding: '3rem 2rem',
      borderRadius: '16px',
      margin: '2rem 0'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '0.75rem',
          marginTop: 0
        }}>
          Smart Data Comparator
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#64748b',
          margin: 0
        }}>
          An internal tool that validates Sainpase/CPQ Data with Form Data
        </p>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Order Validation Tool Card */}
        <div
          onClick={() => onNavigate('validation-type')}
          style={{
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.03)';
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '0.5rem'
          }}>
            🔍
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0
          }}>
            Order Validation Tool
          </h3>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Compare tables, apply matrix rules, and identify mismatches with precision.
          </p>
        </div>

        {/* User Guide Card */}
        <div
          onClick={() => window.open('/comparator/help.html', '_blank')}
          style={{
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.03)';
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '0.5rem'
          }}>
            📘
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0
          }}>
            User Guide
          </h3>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Learn how to map columns and clean data for accurate results.
          </p>
        </div>
      </main>

      <footer style={{
        marginTop: '3rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        Designed & Developed by <strong style={{ color: '#1e293b' }}>TP Team</strong>
      </footer>
    </div>
  );
}

export default LandingPage;
