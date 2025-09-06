import React, { useState, useEffect } from 'react';
import { productService, authService } from '../services';
import Header from '../components/Header';
import './ProductPages.css';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  
  // Filtered and processed products
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchUserListings();
  }, []);

  useEffect(() => {
    processProducts();
  }, [products, searchTerm, sortBy, filterBy, groupBy]);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authService.isAuthenticated()) {
        setError('Please log in to view your listings');
        return;
      }

      const response = await productService.getUserProducts();
      const userProducts = response.products || response || [];
      setProducts(userProducts);
      
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const processProducts = () => {
    let processed = [...products];

    // Search filter
    if (searchTerm) {
      processed = processed.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'active':
          processed = processed.filter(p => p.quantity > 0);
          break;
        case 'sold':
          processed = processed.filter(p => p.quantity === 0);
          break;
        case 'draft':
          processed = processed.filter(p => p.status === 'draft');
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        processed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        processed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        processed.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'price-low':
        processed.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'name':
        processed.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredProducts(processed);
  };

  const getProductStatus = (product) => {
    if (product.quantity === 0) return 'sold';
    if (product.status === 'draft') return 'draft';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'sold': return 'blue';
      case 'draft': return 'orange';
      default: return 'gray';
    }
  };

  const groupProducts = (products) => {
    if (groupBy === 'none') {
      return { 'All Products': products };
    }

    return products.reduce((groups, product) => {
      let key;
      switch (groupBy) {
        case 'category':
          key = product.category?.name || 'Uncategorized';
          break;
        case 'status':
          key = getProductStatus(product);
          break;
        case 'price':
          const price = parseFloat(product.price);
          if (price < 50) key = 'Under $50';
          else if (price < 200) key = '$50 - $200';
          else if (price < 500) key = '$200 - $500';
          else key = '$500+';
          break;
        default:
          key = 'All Products';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
      return groups;
    }, {});
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your listings...</p>
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
            <button className="retry-button" onClick={fetchUserListings}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedProducts = groupProducts(filteredProducts);

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
                  placeholder="Search your listings..."
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
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Filter:</label>
                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Group by:</label>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="none">No Grouping</option>
                  <option value="category">Category</option>
                  <option value="status">Status</option>
                  <option value="price">Price Range</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing {filteredProducts.length} of {products.length} listings
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="page-content">
        <div className="container">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No listings found</h3>
              <p>
                {searchTerm 
                  ? `No listings match "${searchTerm}"`
                  : "You haven't created any listings yet"
                }
              </p>
              <button className="primary-button">Create Your First Listing</button>
            </div>
          ) : (
            Object.entries(groupedProducts).map(([groupName, groupProducts]) => (
              <div key={groupName} className="product-group">
                {groupBy !== 'none' && (
                  <div className="group-header">
                    <h3>{groupName}</h3>
                    <span className="group-count">({groupProducts.length} items)</span>
                  </div>
                )}
                
                <div className="products-grid">
                  {groupProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={`http://localhost:3000/uploads/${product.images[0]}`} 
                            alt={product.title}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <span>📷</span>
                          </div>
                        )}
                        <div className={`product-status ${getStatusColor(getProductStatus(product))}`}>
                          {getProductStatus(product)}
                        </div>
                      </div>
                      
                      <div className="product-info">
                        <h4 className="product-title">{product.title}</h4>
                        <p className="product-description">
                          {product.description?.substring(0, 100)}
                          {product.description?.length > 100 && '...'}
                        </p>
                        
                        <div className="product-details">
                          <span className="product-price">${product.price}</span>
                          <span className="product-quantity">Qty: {product.quantity}</span>
                        </div>
                        
                        {product.category && (
                          <span className="product-category">{product.category.name}</span>
                        )}
                        
                        <div className="product-meta">
                          <span className="product-date">
                            Listed {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="product-actions">
                          <button className="edit-button">Edit</button>
                          <button className="view-button">View</button>
                          <button className="delete-button">Delete</button>
                        </div>
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

export default MyListings;
