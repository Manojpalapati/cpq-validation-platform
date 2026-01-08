import StatusBadge from './StatusBadge.jsx';
import ResultSummary from './ResultSummary.jsx';
import { triggerAutomation } from '../services/api.js';

function OrderTable({ orders, onOrderClick }) {
  const handleTrigger = async (order, e) => {
    e.stopPropagation();
    await triggerAutomation(order.id);
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th align="left">Order</th>
          <th align="left">PO</th>
          <th align="left">Type</th>
          <th align="left">Status</th>
          <th align="left">Result</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No orders found. Orders will appear here after automation runs.
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr 
              key={order.id} 
              style={{ 
                borderTop: '1px solid #e2e8f0',
                cursor: onOrderClick ? 'pointer' : 'default'
              }}
              onClick={() => onOrderClick && onOrderClick(order)}
            >
              <td>{order.orderNumber}</td>
              <td>{order.poNumber}</td>
              <td>{order.type}</td>
              <td><StatusBadge status={order.status} /></td>
              <td><ResultSummary summary={order.resultSummary} /></td>
              <td>
                <button 
                  onClick={(e) => handleTrigger(order, e)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Run
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default OrderTable;
