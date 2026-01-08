import { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Comparator from './pages/Comparator.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigateTo = (page, order = null) => {
    setCurrentPage(page);
    setSelectedOrder(order);
  };

  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="nav-brand">
          <h1>CPQ Validation Platform</h1>
        </div>
        <div className="nav-links">
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => navigateTo('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentPage === 'comparator' ? 'active' : ''}
            onClick={() => navigateTo('comparator')}
          >
            Data Comparator
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard onOrderSelect={(order) => navigateTo('details', order)} />
        )}
        {currentPage === 'comparator' && <Comparator />}
        {currentPage === 'details' && selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
            onBack={() => navigateTo('dashboard')} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
