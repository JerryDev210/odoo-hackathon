import React, { useState, useEffect } from 'react';
import { authService, productService, userService  } from '../services';
import './UserProfile.css';
import Header from '../components/Header';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // New states for dynamic data
  const [userListings, setUserListings] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Profile picture states
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, skipping stats fetch');
        return;
      }

      // Fetch user's listings
      try {
        const listings = await productService.getUserProducts();
        setUserListings(listings.products || listings || []);
        console.log('User listings:', listings);
      } catch (listingError) {
        console.error('Failed to fetch listings:', listingError);
        setUserListings([]);
      }

      // Fetch user's purchase history
      try {
        const purchases = await userService.getOrderHistory();
        setUserPurchases(purchases.orders || purchases || []);
        console.log('User purchases:', purchases);
      } catch (purchaseError) {
        console.error('Failed to fetch purchases:', purchaseError);
        setUserPurchases([]);
      }
      
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // First try to get user from localStorage (already logged in)
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setEditForm({
          fullName: currentUser.fullName || '',
          username: currentUser.username || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || ''
        });
        setLoading(false);
        return;
      }

      // If no user in localStorage, try to fetch from API
      try {
        const userData = await authService.getProfile();
        const userInfo = userData.user || userData;
        setUser(userInfo);
        setEditForm({
          fullName: userInfo.fullName || '',
          username: userInfo.username || '',
          email: userInfo.email || '',
          phone: userInfo.phone || '',
          address: userInfo.address || ''
        });
      } catch (apiError) {
        // If API call fails and no user in localStorage, show error
        setError('Please log in to view your profile');
        console.error('Profile fetch error:', apiError);
      }
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form to current user data when starting edit
      setEditForm({
        fullName: user?.fullName || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      setError(null);

      // Create update payload (exclude username since it's disabled)
      const updatePayload = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      };

      console.log('Updating profile with:', updatePayload);

      // Update profile using authService
      const updatedData = await authService.updateProfile(updatePayload);
      
      console.log('Update response:', updatedData);

      // Update local state
      const newUserData = updatedData.user || updatedData;
      setUser(newUserData);
      
      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error details:', err);
      setError('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  // Profile picture functions
  const handleProfilePictureSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;
    
    try {
      setUploadingPicture(true);
      
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      
      const response = await authService.uploadProfilePicture(formData);
      
      // Update user data with new profile picture
      const updatedUser = { 
        ...user, 
        profilePicture: response.profilePictureUrl || response.user?.profilePicture 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Clear upload states
      setProfilePicture(null);
      setProfilePicturePreview(null);
      
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Profile picture upload error:', err);
      alert('Failed to upload profile picture: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleCancelPictureUpload = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">⚠️ {error}</div>
          <button className="retry-button" onClick={fetchUserProfile}>
            Try Again
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Please make sure you're logged in first.
          </p>
        </div>
      </div>
    );
  }

  // Debug: Log user data to console
  console.log('Current user data:', user);
  console.log('User listings count:', userListings.length);
  console.log('User purchases count:', userPurchases.length);

  // Calculate completed sales (products that have been sold)
  const completedSales = userListings.filter(product => product.quantity === 0 || product.status === 'sold').length;
  const activeListing = userListings.filter(product => product.quantity > 0 && product.status !== 'sold').length;

  const navigationItems = [
    {
      title: 'My Listings',
      description: 'View and manage your product listings',
      icon: '📦',
      path: '/my-listings',
      count: userListings.length
    },
    {
      title: 'My Purchases',
      description: 'View your purchase history',
      icon: '🛒',
      path: '/my-purchases',
      count: userPurchases.length
    },
  ];

  return (
    <div className="profile-page">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="profile-content">
        <div className="container">
          <div className="profile-grid">
            
            {/* Left Column - User Details */}
            <div className="user-details-column">
              <div className="user-details-card">
                <div className="profile-avatar-section">
                  {/* Profile Picture */}
                  <div className="avatar-wrapper">
                    <div className="profile-avatar">
                      {profilePicturePreview ? (
                        <img src={profilePicturePreview} alt="Profile Preview" className="avatar-image" />
                      ) : user?.profilePicture ? (
                        <img 
                          src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`} 
                          alt="Profile" 
                          className="avatar-image" 
                        />
                      ) : (
                        <span className="avatar-initials">
                          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    
                    {/* Profile Picture Upload */}
                    <div className="avatar-upload-section">
                      {profilePicture ? (
                        <div className="upload-actions">
                          <button 
                            className="upload-btn" 
                            onClick={handleProfilePictureUpload}
                            disabled={uploadingPicture}
                          >
                            {uploadingPicture ? '⏳' : '✓'} {uploadingPicture ? 'Uploading...' : 'Save Picture'}
                          </button>
                          <button 
                            className="cancel-upload-btn" 
                            onClick={handleCancelPictureUpload}
                            disabled={uploadingPicture}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="profile-picture-input"
                            accept="image/*"
                            onChange={handleProfilePictureSelect}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="profile-picture-input" className="avatar-edit-btn">
                            📷
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="user-name">
                    {user?.fullName || 'User Name'}
                  </h2>
                  <p className="username">@{user?.username}</p>
                </div>

                {/* User Details */}
                <div className="user-info">
                  <div className="info-section">
                    <h3>Contact Information</h3>
                    
                    {isEditing ? (
                      /* Edit Mode */
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Full Name:</label>
                          <input 
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Username:</label>
                          <input 
                            type="text"
                            value={editForm.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            placeholder="Username cannot be changed"
                            disabled
                            className="disabled-field"
                          />
                          <small className="field-note">Username cannot be changed after registration</small>
                        </div>
                        
                        <div className="form-group">
                          <label>Email:</label>
                          <input 
                            type="email"
                            value={editForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter email address"
                          />
                          <small className="field-note">⚠️ Changing email may require re-verification</small>
                        </div>
                        
                        <div className="form-group">
                          <label>Phone:</label>
                          <input 
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter phone number"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Address:</label>
                          <textarea 
                            value={editForm.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter your address"
                            rows="3"
                          />
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="contact-list">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span className="contact-text">{user?.email || 'Not provided'}</span>
                        </div>
                        
                        <div className="contact-item">
                          <span className="contact-icon">📱</span>
                          <span className="contact-text">{user?.phone || 'Not provided'}</span>
                        </div>
                        
                        <div className="contact-item">
                          <span className="contact-icon">🏠</span>
                          <span className="contact-text">{user?.address || 'Not provided'}</span>
                        </div>
                        
                        {/* Show additional user details if available */}
                        {user?.createdAt && (
                          <div className="contact-item">
                            <span className="contact-icon">📅</span>
                            <span className="contact-text">Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {user?.id && (
                          <div className="contact-item">
                            <span className="contact-icon">🆔</span>
                            <span className="contact-text">User ID: {user.id}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Edit Profile Buttons */}
                  <div className="action-section">
                    {isEditing ? (
                      <div className="edit-buttons">
                        <button 
                          className="save-btn" 
                          onClick={handleSaveProfile}
                          disabled={updateLoading}
                        >
                          {updateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="edit-profile-btn" onClick={handleEditToggle}>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation */}
            <div className="navigation-column">
              <div className="navigation-card">
                <h3>Quick Actions</h3>
                
                <div className="navigation-grid">
                  {navigationItems.map((item, index) => (
                    <div key={index} className="nav-item">
                      <div className="nav-content">
                        <div className="nav-header">
                          <span className="nav-icon">{item.icon}</span>
                          <h4 className="nav-title">{item.title}</h4>
                        </div>
                        <p className="nav-description">{item.description}</p>
                        {item.count !== null && (
                          <span className="nav-count">{item.count} items</span>
                        )}
                      </div>
                      <div className="nav-arrow">→</div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats Cards */}
                <div className="activity-section">
                  <h3>Activity Overview</h3>
                  {statsLoading ? (
                    <div className="stats-loading">Loading stats...</div>
                  ) : (
                    <div className="activity-grid">
                      <div className="activity-card blue">
                        <div className="activity-number">{activeListing}</div>
                        <div className="activity-label">Active Listings</div>
                      </div>
                      <div className="activity-card green">
                        <div className="activity-number">{completedSales}</div>
                        <div className="activity-label">Completed Sales</div>
                      </div>
                      <div className="activity-card purple">
                        <div className="activity-number">0</div>
                        <div className="activity-label">Saved Items</div>
                      </div>
                      <div className="activity-card orange">
                        <div className="activity-number">{userPurchases.length}</div>
                        <div className="activity-label">Total Purchases</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Listings Preview */}
                {userListings.length > 0 && (
                  <div className="recent-listings-section">
                    <h3>Recent Listings</h3>
                    <div className="recent-items">
                      {userListings.slice(0, 3).map((product, index) => (
                        <div key={index} className="recent-item">
                          <div className="item-info">
                            <h4>{product.title}</h4>
                            <p>${product.price}</p>
                            <span className={`item-status ${product.quantity > 0 ? 'active' : 'sold'}`}>
                              {product.quantity > 0 ? 'Active' : 'Sold'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="view-all-btn">View All Listings →</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
