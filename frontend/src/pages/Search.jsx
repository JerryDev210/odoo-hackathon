import React, { useState, useEffect } from 'react';
import { productService, categoryService, cartService, authService } from '../services';
import Header from '../components/Header';
import './ProductPages.css';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [groupBy, setGroupBy] = useState('none');
  
  // Filtered and processed products
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Cart states
  const [addingToCart, setAddingToCart] = useState({});
  const [cartSuccess, setCartSuccess] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    processProducts();
  }, [products, searchTerm, sortBy, filterBy, categoryFilter, priceRange, groupBy]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and categories
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      
      setProducts(productsResponse.products || productsResponse || []);
      setCategories(categoriesResponse.categories || categoriesResponse || []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load products');
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

    // Category filter
    if (categoryFilter !== 'all') {
      processed = processed.filter(product => 
        product.categoryId?.toString() === categoryFilter
      );
    }

    // Availability filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'available':
          processed = processed.filter(p => p.quantity > 0);
          break;
        case 'sold-out':
          processed = processed.filter(p => p.quantity === 0);
          break;
      }
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      processed = processed.filter(product => {
        const price = parseFloat(product.price);
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
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
      case 'popularity':
        // Assuming we have a popularity score or views
        processed.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    setFilteredProducts(processed);
  };

  const getProductStatus = (product) => {
    if (product.quantity === 0) return 'sold-out';
    if (product.quantity < 5) return 'low-stock';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'low-stock': return 'orange';
      case 'sold-out': return 'red';
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
        case 'price':
          const price = parseFloat(product.price);
          if (price < 50) key = 'Under $50';
          else if (price < 200) key = '$50 - $200';
          else if (price < 500) key = '$200 - $500';
          else key = '$500+';
          break;
        case 'availability':
          key = getProductStatus(product);
          break;
        case 'seller':
          key = product.user?.fullName || product.user?.username || 'Unknown Seller';
          break;
        default:
          key = 'All Products';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
      return groups;
    }, {});
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setFilterBy('all');
    setCategoryFilter('all');
    setPriceRange({ min: '', max: '' });
    setGroupBy('none');
  };

  const hasActiveFilters = () => {
    return searchTerm || filterBy !== 'all' || categoryFilter !== 'all' || 
           priceRange.min || priceRange.max || groupBy !== 'none';
  };

  // Cart functions
  const handleAddToCart = async (product) => {
    console.log('🔥 Button clicked for product:', product.id, product.title);
    alert('Button click detected! Product: ' + product.title);
    
    try {
      console.log('Adding to cart:', product.id, product.title);
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        alert('Please log in to add items to cart');
        return;
      }

      // Check if user owns this product
      const currentUser = authService.getCurrentUser();
      if (currentUser && product.userId === currentUser.id) {
        alert('You cannot add your own product to cart');
        return;
      }

      // Set loading state for this specific product
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));

      console.log('Calling cartService.addToCart with productId:', product.id);
      
      // Add to cart
      const result = await cartService.addToCart(product.id, 1);
      
      console.log('Cart service response:', result);

      // Show success state
      setCartSuccess(prev => ({ ...prev, [product.id]: true }));
      
      // Clear success state after 2 seconds
      setTimeout(() => {
        setCartSuccess(prev => ({ ...prev, [product.id]: false }));
      }, 2000);

    } catch (err) {
      console.error('Error adding to cart:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      let errorMessage = 'Failed to add item to cart';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleViewDetails = (product) => {
    // Navigate to product details page
    // For now, just console log
    console.log('View details for product:', product);
    alert(`Product: ${product.title}\nPrice: $${product.price}\nDescription: ${product.description}`);
  };

  const handleAddToWishlist = async (product) => {
    try {
      if (!authService.isAuthenticated()) {
        alert('Please log in to add items to wishlist');
        return;
      }
      
      // TODO: Implement wishlist functionality
      alert('Wishlist functionality coming soon!');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
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
            <button className="retry-button" onClick={fetchInitialData}>
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
                  placeholder="Search products, categories, or sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-section">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="name">Name A-Z</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Category:</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Availability:</label>
                  <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="all">All Items</option>
                    <option value="available">Available</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Group by:</label>
                  <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                    <option value="none">No Grouping</option>
                    <option value="category">Category</option>
                    <option value="price">Price Range</option>
                    <option value="availability">Availability</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-row">
                <div className="price-range-group">
                  <label>Price Range:</label>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="price-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="price-input"
                    />
                  </div>
                </div>

                {hasActiveFilters() && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing {filteredProducts.length} of {products.length} products
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
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>
                {searchTerm 
                  ? `No products match "${searchTerm}"`
                  : "Try adjusting your filters or search terms"
                }
              </p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
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
                          {getProductStatus(product) === 'sold-out' ? 'Sold Out' : 
                           getProductStatus(product) === 'low-stock' ? 'Low Stock' : 'Available'}
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
                          <span className="product-quantity">
                            {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                          </span>
                        </div>
                        
                        <div className="product-metadata">
                          {product.category?.name && (
                            <span className="product-category">{product.category.name}</span>
                          )}
                          {(product.user?.fullName || product.user?.username) && (
                            <span className="product-seller">
                              by {product.user.fullName || product.user.username}
                            </span>
                          )}
                        </div>
                        
                        <div className="product-meta">
                          <span className="product-date">
                            Listed {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="product-actions">
                          <button 
                            className="view-button"
                            onClick={() => handleViewDetails(product)}
                          >
                            View Details
                          </button>
                          {product.quantity > 0 ? (
                            <button 
                              className={`add-to-cart-button ${cartSuccess[product.id] ? 'success' : ''}`}
                              onClick={() => handleAddToCart(product)}
                            //   disabled={addingToCart[product.id]}
                            >
                              {addingToCart[product.id] ? (
                                '⏳ Adding...'
                              ) : cartSuccess[product.id] ? (
                                '✓ Added!'
                              ) : (
                                '🛒 Add to Cart'
                              )}
                            </button>
                          ) : (
                            <button 
                              className="wishlist-button"
                              onClick={() => handleAddToWishlist(product)}
                            >
                              💝 Add to Wishlist
                            </button>
                          )}
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

export default Search;
