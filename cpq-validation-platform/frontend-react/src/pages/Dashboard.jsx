import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import OrderTable from '../components/OrderTable.jsx';

function Dashboard({ onOrderSelect }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="card">
      <h2>Orders Dashboard</h2>
      <p className="subtitle">View and manage CPQ validation orders</p>
      <OrderTable orders={orders} onOrderClick={onOrderSelect} />
    </div>
  );
}

export default Dashboard;
