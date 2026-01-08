import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Comparator from './pages/Comparator.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ValidationTypePage from './pages/ValidationTypePage.jsx';
import OrderOverview from './pages/OrderOverview.jsx';
import './styles.css';

function App() {
  // Parse URL to get initial page and data
  const getPageFromUrl = () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path.includes('/comparator')) return 'comparator';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/validation-type')) return 'validation-type';
    if (path.includes('/order/')) {
      const orderId = path.split('/order/')[1];
      return { page: 'order-overview', orderId };
    }
    return 'landing';
  };

  const initialRoute = getPageFromUrl();
  const [currentPage, setCurrentPage] = useState(
    typeof initialRoute === 'object' ? initialRoute.page : initialRoute
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderId, setOrderId] = useState(
    typeof initialRoute === 'object' ? initialRoute.orderId : null
  );

  // Initialize browser history on mount
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({ page: 'landing' }, '', '/');
    }
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        const { page, orderId: stateOrderId, order } = event.state;
        setCurrentPage(page || 'landing');
        if (stateOrderId) {
          setOrderId(stateOrderId);
          setSelectedOrder(null);
        } else if (order) {
          setSelectedOrder(order);
          setOrderId(order.id);
        } else {
          setSelectedOrder(null);
          setOrderId(null);
        }
      } else {
        // Fallback to URL parsing
        const route = getPageFromUrl();
        if (typeof route === 'object') {
          setCurrentPage(route.page);
          setOrderId(route.orderId);
        } else {
          setCurrentPage(route);
          setOrderId(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page, data = null) => {
    let url = '/';
    let state = { page };

    if (page === 'landing') {
      url = '/';
    } else if (page === 'validation-type') {
      url = '/validation-type';
    } else if (page === 'dashboard') {
      url = '/dashboard';
    } else if (page === 'comparator') {
      url = '/comparator';
    } else if (page === 'order-overview' && data) {
      const id = typeof data === 'object' && data.id ? data.id : data;
      url = `/order/${id}`;
      state.orderId = id;
      setOrderId(id);
      setSelectedOrder(null);
    } else if (page === 'details' && data) {
      url = `/order/${data.id}`;
      state.order = data;
      setSelectedOrder(data);
      setOrderId(data.id);
    }

    if (data && typeof data === 'object' && data.id) {
      setSelectedOrder(data);
      setOrderId(data.id);
    } else if (typeof data === 'string') {
      setOrderId(data);
      setSelectedOrder(null);
    } else if (!data) {
      setSelectedOrder(null);
      if (page !== 'order-overview') {
        setOrderId(null);
      }
    }

    setCurrentPage(page);
    window.history.pushState(state, '', url);
  };

  const handleLandingNavigation = (page) => {
    navigateTo(page);
  };

  const handleValidationTypeSelect = (type) => {
    if (type === 'sainapse') {
      navigateTo('comparator');
    } else if (type === 'cpq') {
      navigateTo('dashboard');
    }
  };

  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="nav-brand">
          <h1>CPQ Validation Platform</h1>
        </div>
        <div className="nav-links">
          {/* Only show Order Validation Tool button when NOT on validation-type or comparator pages */}
          {currentPage !== 'validation-type' && currentPage !== 'comparator' && (
            <button 
              className={currentPage === 'landing' ? 'active' : ''}
              onClick={() => navigateTo('landing')}
            >
              Order Validation Tool
            </button>
          )}
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => navigateTo('dashboard')}
          >
            CPQ Dashboard
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={handleLandingNavigation} />
        )}
        {currentPage === 'validation-type' && (
          <ValidationTypePage 
            onSelect={handleValidationTypeSelect}
          />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard onOrderSelect={(order) => navigateTo('order-overview', order)} />
        )}
        {currentPage === 'comparator' && (
          <Comparator />
        )}
        {currentPage === 'order-overview' && orderId && (
          <OrderOverview 
            orderId={orderId}
          />
        )}
        {currentPage === 'details' && selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
