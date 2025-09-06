import React, { useState, useEffect } from 'react';
import { userService, authService } from '../services';
import Header from '../components/Header';
import './ProductPages.css';

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  
  // Filtered and processed orders
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchUserPurchases();
  }, []);

  useEffect(() => {
    processOrders();
  }, [orders, searchTerm, sortBy, filterBy, groupBy]);

  const fetchUserPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authService.isAuthenticated()) {
        setError('Please log in to view your purchases');
        return;
      }

      const response = await userService.getOrderHistory();
      const userOrders = response.orders || response || [];
      setOrders(userOrders);
      
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to load your purchase history');
    } finally {
      setLoading(false);
    }
  };

  const processOrders = () => {
    let processed = [...orders];

    // Search filter
    if (searchTerm) {
      processed = processed.filter(order =>
        order.orderItems?.some(item =>
          item.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product?.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || order.id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterBy !== 'all') {
      processed = processed.filter(order => order.status === filterBy);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        processed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        processed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'total-high':
        processed.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
        break;
      case 'total-low':
        processed.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));
        break;
    }

    setFilteredOrders(processed);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'shipped': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const groupOrders = (orders) => {
    if (groupBy === 'none') {
      return { 'All Orders': orders };
    }

    return orders.reduce((groups, order) => {
      let key;
      switch (groupBy) {
        case 'status':
          key = order.status || 'Unknown';
          break;
        case 'month':
          const date = new Date(order.createdAt);
          key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          break;
        case 'total':
          const total = parseFloat(order.total);
          if (total < 50) key = 'Under $50';
          else if (total < 200) key = '$50 - $200';
          else if (total < 500) key = '$200 - $500';
          else key = '$500+';
          break;
        default:
          key = 'All Orders';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
      return groups;
    }, {});
  };

  const getTotalItems = (order) => {
    return order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your purchases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-content">
            <div className="error-message">⚠️ {error}</div>
            <button className="retry-button" onClick={fetchUserPurchases}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedOrders = groupOrders(filteredOrders);

  return (
    <div className="page-container">
      <Header />
      {/* Controls */}
      <div className="page-controls">
        <div className="container">
          <div className="controls-grid">
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search orders by product name or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-section">
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="total-high">Total: High to Low</option>
                  <option value="total-low">Total: Low to High</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Filter:</label>
                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Group by:</label>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="none">No Grouping</option>
                  <option value="status">Status</option>
                  <option value="month">Month</option>
                  <option value="total">Total Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="page-content">
        <div className="container">
          {Object.keys(groupedOrders).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>No purchases found</h3>
              <p>
                {searchTerm 
                  ? `No orders match "${searchTerm}"`
                  : "You haven't made any purchases yet"
                }
              </p>
              <button className="primary-button">Start Shopping</button>
            </div>
          ) : (
            Object.entries(groupedOrders).map(([groupName, groupOrders]) => (
              <div key={groupName} className="product-group">
                {groupBy !== 'none' && (
                  <div className="group-header">
                    <h3>{groupName}</h3>
                    <span className="group-count">({groupOrders.length} orders)</span>
                  </div>
                )}
                
                <div className="orders-list">
                  {groupOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Order #{order.id}</h4>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="order-summary">
                          <span className={`order-status ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="order-total">${order.total}</span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.orderItems?.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-image">
                              {item.product?.images && item.product.images.length > 0 ? (
                                <img 
                                  src={`http://localhost:3000/uploads/${item.product.images[0]}`} 
                                  alt={item.product.title}
                                />
                              ) : (
                                <div className="placeholder-image">
                                  <span>📷</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="item-details">
                              <h5>{item.product?.title}</h5>
                              <p>{item.product?.description?.substring(0, 80)}...</p>
                              <div className="item-meta">
                                <span>Qty: {item.quantity}</span>
                                <span>Price: ${item.price}</span>
                                {item.product?.category && (
                                  <span className="item-category">{item.product.category.name}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-actions">
                        <button className="view-button">View Details</button>
                        <button className="track-button">Track Order</button>
                        {order.status === 'completed' && (
                          <button className="review-button">Leave Review</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPurchases;
