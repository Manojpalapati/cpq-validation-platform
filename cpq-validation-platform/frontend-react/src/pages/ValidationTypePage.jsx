/**
 * Validation Type Selection Page
 * Intermediate page to choose between Sainapse and CPQ validation
 */
function ValidationTypePage({ onSelect }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '2rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          Select Validation Type
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Choose the type of validation you want to perform
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Sainapse Validation Card */}
        <div
          onClick={() => onSelect('sainapse')}
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
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#9333ea';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(147, 51, 234, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.03)';
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            📊
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#1e293b',
            margin: 0
          }}>
            Sainapse Validation
          </h3>
          <p style={{ 
            color: '#64748b', 
            fontSize: '0.875rem',
            textAlign: 'center',
            margin: 0
          }}>
            Compare Form Data with Sainpase/CPQ Data using the data comparator tool
          </p>
        </div>

        {/* CPQ Validation Card */}
        <div
          onClick={() => onSelect('cpq')}
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
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            ⚙️
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#1e293b',
            margin: 0
          }}>
            CPQ Validation
          </h3>
          <p style={{ 
            color: '#64748b', 
            fontSize: '0.875rem',
            textAlign: 'center',
            margin: 0
          }}>
            Run automated CPQ validation using Playwright automation engine
          </p>
        </div>
      </div>
    </div>
  );
}

export default ValidationTypePage;
