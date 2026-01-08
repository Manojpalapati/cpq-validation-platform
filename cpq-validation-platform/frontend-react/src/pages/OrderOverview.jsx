import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { triggerCPQAutomation } from '../services/api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import ResultSummary from '../components/ResultSummary.jsx';

/**
 * Order Overview Page
 * Displays order details and allows triggering CPQ validation
 */
function OrderOverview({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder({ id: snapshot.id, ...snapshot.data() });
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleRunValidation = async () => {
    if (!order || running) return;
    
    // Check if validation can be run
    if (order.status === 'IN_PROGRESS' || order.status === 'PASSED') {
      return;
    }

    setRunning(true);
    
    try {
      // Update status to IN_PROGRESS
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'IN_PROGRESS',
        updatedAt: new Date().toISOString()
      });

      // Trigger backend automation
      await triggerCPQAutomation(orderId);
      
    } catch (error) {
      console.error('Error triggering validation:', error);
      // Revert status on error
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: order.status,
        updatedAt: new Date().toISOString()
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b' }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ color: '#64748b' }}>Order not found</p>
        </div>
      </div>
    );
  }

  const canRunValidation = order.status === 'PENDING' || order.status === 'FAILED';
  const isDisabled = !canRunValidation || running;

  return (
    <div className="card">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Order {order.orderNumber}</h2>
        <p style={{ color: '#64748b', margin: 0 }}>PO Number: {order.poNumber || 'N/A'}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Status</div>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Type</div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{order.type || 'N/A'}</div>
        </div>
        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Created</div>
          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
            {order.createdAt 
              ? (order.createdAt.seconds 
                  ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                  : new Date(order.createdAt).toLocaleString())
              : 'N/A'}
          </div>
        </div>
        {order.verifiedAt && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Last Verified</div>
            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
              {order.verifiedAt.seconds 
                ? new Date(order.verifiedAt.seconds * 1000).toLocaleString()
                : new Date(order.verifiedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {order.resultSummary && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Validation Results</h3>
          <ResultSummary summary={order.resultSummary} />
        </div>
      )}

      <div style={{ 
        padding: '1.5rem', 
        background: '#f8fafc', 
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>CPQ Validation</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {canRunValidation 
            ? 'Click the button below to run automated CPQ validation. This will execute Playwright automation in headless mode.'
            : order.status === 'IN_PROGRESS'
            ? 'Validation is currently in progress. Please wait for it to complete.'
            : 'This order has already passed validation.'}
        </p>
        <button
          onClick={handleRunValidation}
          disabled={isDisabled}
          style={{
            padding: '0.75rem 2rem',
            background: isDisabled ? '#cbd5e1' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {running ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              Running Validation...
            </>
          ) : (
            <>
              ▶️ Run CPQ Validation
            </>
          )}
        </button>
        {order.status === 'IN_PROGRESS' && (
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⏳</span> Validation is running. Status will update automatically when complete.
          </p>
        )}
      </div>
    </div>
  );
}

export default OrderOverview;
