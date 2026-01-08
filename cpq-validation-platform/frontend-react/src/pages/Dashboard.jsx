import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { triggerCPQAutomation } from '../services/api.js';
import StatusBadge from '../components/StatusBadge.jsx';

/**
 * CPQ Dashboard
 * Displays locked and saved orders from Sainpase validation
 */
function Dashboard({ onOrderSelect }) {
  const [orders, setOrders] = useState([]);
  const [findOrderId, setFindOrderId] = useState('');
  const [finding, setFinding] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);
  const [findError, setFindError] = useState('');
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [runningValidation, setRunningValidation] = useState(false);

  // Load locked and saved orders
  useEffect(() => {
    // Always load from localStorage first (works even without Firebase)
    loadOrdersFromLocalStorage(true);
    
    // If Firebase is configured, also listen to Firebase for real-time updates
    if (db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          // Filter to show only orders that have been locked/saved (have sainpaseValidationDone flag or status)
          const lockedOrders = data.filter(order => 
            order.sainpaseValidationDone === true || 
            order.status === 'SAINPASE_DONE' ||
            order.status === 'CPQ_PENDING' ||
            order.status === 'CPQ_DONE'
          );
          // Merge Firebase orders with localStorage orders (Firebase takes priority)
          const localStorageOrders = loadOrdersFromLocalStorage(false);
          const allOrders = [...lockedOrders, ...localStorageOrders.filter(lo => 
            !lockedOrders.find(fo => fo.id === lo.id)
          )];
          setOrders(allOrders.sort((a, b) => {
            const timeA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() / 1000 : 0);
            const timeB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() / 1000 : 0);
            return timeB - timeA;
          }));
        }, (error) => {
          console.warn('Firebase error, using localStorage only:', error);
          // Keep using localStorage data
        });
        return () => unsub();
      } catch (error) {
        console.warn('Firebase query failed, using localStorage only:', error);
        // Keep using localStorage data
      }
    } else {
      console.log('Firebase not configured, using localStorage only');
    }
  }, []);

  const loadOrdersFromLocalStorage = (updateState = true) => {
    const allOrders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('MOCK_DB_')) {
        try {
          const orderId = key.replace('MOCK_DB_', '');
          const data = JSON.parse(localStorage.getItem(key));
          allOrders.push({
            id: orderId,
            orderNumber: data.orderId || orderId,
            sainpaseValidationDone: true,
            cpqValidationStatus: 'PENDING',
            status: 'SAINPASE_DONE',
            createdAt: data.timestamp ? { seconds: new Date(data.timestamp).getTime() / 1000 } : { seconds: Date.now() / 1000 },
            poNumber: data.sets && data.sets.length > 0 ? data.sets[0].poNumber : 'N/A',
            ...data
          });
        } catch (e) {
          console.warn('Failed to parse localStorage order:', key, e);
        }
      }
    }
    const sorted = allOrders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    
    // Only update state if explicitly requested (from initial load)
    if (updateState) {
      setOrders(sorted);
      console.log(`Loaded ${sorted.length} order(s) from localStorage`);
    }
    
    return sorted;
  };

  const handleFindOrder = async () => {
    if (!findOrderId.trim()) {
      setFindError('Please enter an Order Reference number');
      return;
    }

    setFinding(true);
    setFindError('');
    setFoundOrder(null);

    try {
      // First check localStorage (for mock data)
      const mockData = localStorage.getItem(`MOCK_DB_${findOrderId}`);
      if (mockData) {
        try {
          const parsed = JSON.parse(mockData);
          setFoundOrder({
            id: findOrderId,
            orderNumber: parsed.orderId || findOrderId,
            sainpaseValidationDone: true,
            cpqValidationStatus: 'PENDING',
            ...parsed
          });
          setFindError('');
          setFinding(false);
          return;
        } catch (e) {
          // Invalid JSON
        }
      }

      // Try Firebase comparator_orders collection
      if (db) {
        try {
          const comparatorRef = doc(db, 'comparator_orders', findOrderId);
          const comparatorSnap = await getDoc(comparatorRef);

          if (comparatorSnap.exists()) {
            const comparatorData = { id: comparatorSnap.id, ...comparatorSnap.data() };
            setFoundOrder({
              id: comparatorData.id,
              orderNumber: comparatorData.orderReference || findOrderId,
              sainpaseValidationDone: true,
              cpqValidationStatus: 'PENDING',
              ...comparatorData
            });
            setFindError('');
            setFinding(false);
            return;
          }

          // Try orders collection
          const orderRef = doc(db, 'orders', findOrderId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            const orderData = { id: orderSnap.id, ...orderSnap.data() };
            if (orderData.sainpaseValidationDone || orderData.status === 'SAINPASE_DONE') {
              setFoundOrder(orderData);
              setFindError('');
              setFinding(false);
              return;
            }
          }
        } catch (firebaseError) {
          console.warn('Firebase error:', firebaseError.message);
        }
      }

      setFindError('Order not found. Please check the Order Reference number.');
    } catch (error) {
      console.error('Error finding order:', error);
      setFindError('Error searching for order. Please try again.');
    } finally {
      setFinding(false);
    }
  };

  const handleRunCPQValidation = () => {
    if (!foundOrder) return;
    setShowVerificationPopup(true);
  };

  const handleConfirmVerification = async () => {
    setShowVerificationPopup(false);
    setRunningValidation(true);

    try {
      const orderId = foundOrder.id || foundOrder.orderNumber;
      
      // Update order status to CPQ_IN_PROGRESS
      if (db) {
        try {
          const orderRef = doc(db, 'orders', orderId);
          await setDoc(orderRef, {
            orderNumber: foundOrder.orderNumber || orderId,
            sainpaseValidationDone: true,
            cpqValidationStatus: 'IN_PROGRESS',
            status: 'CPQ_IN_PROGRESS',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          console.warn('Failed to update Firebase, continuing with automation');
        }
      } else {
        // Update localStorage if Firebase not available
        const mockData = localStorage.getItem(`MOCK_DB_${orderId}`);
        if (mockData) {
          try {
            const parsed = JSON.parse(mockData);
            parsed.cpqValidationStatus = 'IN_PROGRESS';
            localStorage.setItem(`MOCK_DB_${orderId}`, JSON.stringify(parsed));
          } catch (e) {
            console.warn('Failed to update localStorage');
          }
        }
      }

      // Trigger automation
      await triggerCPQAutomation(orderId);

      // Note: Backend will update status to CPQ_DONE or CPQ_FAILED when complete
      // Frontend will see the update via Firebase listener
      
    } catch (error) {
      console.error('Error running CPQ validation:', error);
      setFindError('Failed to start CPQ validation. Please try again.');
    } finally {
      setRunningValidation(false);
    }
  };

  const getStatusDisplay = (order) => {
    if (order.cpqValidationStatus === 'DONE' || order.status === 'CPQ_DONE' || order.status === 'PASSED') {
      return { text: 'CPQ validation is done', color: '#10b981' };
    }
    if (order.cpqValidationStatus === 'IN_PROGRESS' || order.status === 'CPQ_IN_PROGRESS' || order.status === 'IN_PROGRESS') {
      return { text: 'CPQ validation in progress', color: '#f59e0b' };
    }
    if (order.sainpaseValidationDone || order.status === 'SAINPASE_DONE') {
      return { text: 'Sainpase validation is done and CPQ validation is pending', color: '#64748b' };
    }
    return { text: 'Pending', color: '#64748b' };
  };

  return (
    <div>
      {/* Validator Checker Hub - Find Order Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>Validator Checker Hub</h2>
        <p className="subtitle">Find orders and run CPQ validation</p>
        
        <div style={{ 
          background: '#f8fafc', 
          padding: '1.5rem', 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🔍 Find Order
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Enter Order Reference #..."
                value={findOrderId}
                onChange={(e) => {
                  setFindOrderId(e.target.value);
                  setFindError('');
                  setFoundOrder(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleFindOrder();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: findError ? '1px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = findError ? '#ef4444' : '#e2e8f0'}
              />
            </div>
            <button
              onClick={handleFindOrder}
              disabled={finding}
              style={{
                padding: '0.75rem 1.5rem',
                background: finding ? '#cbd5e1' : '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: finding ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              {finding ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Searching...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Find Order
                </>
              )}
            </button>
          </div>

          {findError && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '0.875rem'
            }}>
              {findError}
            </div>
          )}

          {foundOrder && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600, color: '#065f46', marginBottom: '0.25rem' }}>
                  ✅ Order Found: {foundOrder.orderNumber || foundOrder.id}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                  {getStatusDisplay(foundOrder).text}
                </div>
              </div>
              
              {/* Run CPQ Validation Button - Only show if CPQ validation is pending */}
              {(foundOrder.cpqValidationStatus === 'PENDING' || 
                !foundOrder.cpqValidationStatus || 
                foundOrder.status === 'SAINPASE_DONE') && (
                <button
                  onClick={handleRunCPQValidation}
                  disabled={runningValidation}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: runningValidation ? '#cbd5e1' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningValidation ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  {runningValidation ? (
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Locked and Saved Orders Table */}
      <div className="card">
        <h2>Locked and Saved Orders</h2>
        <p className="subtitle">Orders that have completed Sainpase validation</p>
        
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
            <p>No locked and saved orders found.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Orders will appear here after they are locked and saved from the Comparator tool.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th align="left" style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Order Number</th>
                <th align="left" style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>PO Number</th>
                <th align="left" style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Status</th>
                <th align="left" style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Created</th>
                <th style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order);
                return (
                  <tr 
                    key={order.id}
                    style={{ 
                      borderTop: '1px solid #e2e8f0',
                      cursor: onOrderSelect ? 'pointer' : 'default'
                    }}
                    onClick={() => onOrderSelect && onOrderSelect(order)}
                  >
                    <td style={{ padding: '0.75rem' }}>{order.orderNumber || order.id}</td>
                    <td style={{ padding: '0.75rem' }}>{order.poNumber || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        color: statusInfo.color, 
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {order.createdAt 
                        ? (order.createdAt.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                            : new Date(order.createdAt).toLocaleString())
                        : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOrderSelect && onOrderSelect(order);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Verification Popup */}
      {showVerificationPopup && foundOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#1e293b'
            }}>
              Verify Header Fields
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Please go and verify header fields for Order <strong>{foundOrder.orderNumber || foundOrder.id}</strong>.
            </p>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowVerificationPopup(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#64748b'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerification}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
