import ResultSummary from '../components/ResultSummary.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

function OrderDetails({ order }) {
  if (!order) return null;

  return (
    <div className="card">
      <h2>Order {order.orderNumber}</h2>
      <StatusBadge status={order.status} />
      <ResultSummary summary={order.resultSummary} />
    </div>
  );
}

export default OrderDetails;
