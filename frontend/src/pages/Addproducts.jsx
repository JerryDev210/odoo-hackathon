import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import './Addproducts.css';

const Addproducts = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        description: '',
        price: '',
        quantity: '',
        condition: '',
        yearOfManufacture: '',
        brand: '',
        model: '',
        weight: '',
        material: '',
        color: '',
        originalPackaging: false,
        manualIncluded: false,
        workingConditionDesc: ''
    });

    // Check if user is authenticated and load user profile
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        
        // Load user profile
        loadUserProfile();
        // Load categories
        loadCategories();
    }, [navigate]);

    const loadUserProfile = async () => {
        try {
            const profile = await userService.getProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Failed to load user profile:', error);
            // Continue even if profile loading fails
        }
    };

    const loadCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await categoryService.getCategories();
            setCategories(response.categories || response || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
            // Fallback to default categories if API fails
            setCategories([
                { id: 1, name: 'Electronics' },
                { id: 2, name: 'Home & Garden' },
                { id: 3, name: 'Clothing & Accessories' },
                { id: 4, name: 'Sports & Outdoors' },
                { id: 5, name: 'Books & Media' },
                { id: 6, name: 'Toys & Games' },
                { id: 7, name: 'Automotive' },
                { id: 8, name: 'Health & Beauty' },
                { id: 9, name: 'Collectibles' },
                { id: 10, name: 'Art & Crafts' },
                { id: 11, name: 'Musical Instruments' },
                { id: 12, name: 'Jewelry & Watches' },
                { id: 13, name: 'Other' }
            ]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        // Validate file types and sizes
        const validFiles = [];
        const previews = [];

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Each image must be less than 5MB');
                return;
            }

            validFiles.push(file);
            previews.push(URL.createObjectURL(file));
        });

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
        setError('');
    };

    const removeImage = (index) => {
        // Clean up object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!formData.title.trim()) return 'Title is required';
        if (!formData.categoryId) return 'Category is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.price || formData.price <= 0) return 'Valid price is required';
        if (!formData.quantity || formData.quantity < 0) return 'Valid quantity is required';
        if (!formData.condition) return 'Condition is required';
        if (images.length === 0) return 'At least one image is required';
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                categoryId: parseInt(formData.categoryId),
                yearOfManufacture: formData.yearOfManufacture ? parseInt(formData.yearOfManufacture) : null,
                images: images
            };

            const response = await productService.createProduct(productData);
            
            setSuccess(`Product "${formData.title}" added successfully!`);
            
            // Dispatch event to update cart count or other components
            window.dispatchEvent(new CustomEvent('productAdded', { 
                detail: { product: response.product } 
            }));
            
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    title: '',
                    categoryId: '',
                    description: '',
                    price: '',
                    quantity: '',
                    condition: '',
                    yearOfManufacture: '',
                    brand: '',
                    model: '',
                    weight: '',
                    material: '',
                    color: '',
                    originalPackaging: false,
                    manualIncluded: false,
                    workingConditionDesc: ''
                });
                setImages([]);
                setImagePreviews([]);
                setSuccess('');
            }, 3000);

        } catch (err) {
            setError(err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const conditions = [
        { value: 'new', label: 'New' },
        { value: 'like-new', label: 'Like New' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' }
    ];

    return (
        <div className="add-products-page">
            <Header />
            
            <div className="add-products-container">
                <div className="page-header">
                    <h1>Add New Product</h1>
                    <p>Fill in the details below to list your product for sale</p>
                    {userProfile && (
                        <div className="seller-info">
                            <span className="seller-label">Seller:</span>
                            <span className="seller-name">{userProfile.name || userProfile.username}</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-product-form">
                    {/* Image Upload Section */}
                    <div className="form-section">
                        <h2>Product Images</h2>
                        <div className="image-upload-section">
                            <div className="image-upload-area">
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    className="file-input"
                                />
                                <label htmlFor="images" className="upload-label">
                                    <div className="upload-content">
                                        <span className="upload-icon">📷</span>
                                        <span>Click to upload images</span>
                                        <span className="upload-hint">Maximum 5 images, 5MB each</span>
                                    </div>
                                </label>
                            </div>
                            
                            {imagePreviews.length > 0 && (
                                <div className="image-previews">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={preview} alt={`Preview ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="title">Product Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    placeholder="Enter product title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="categoryId">Category *</label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading || categoriesLoading}
                                >
                                    <option value="">
                                        {categoriesLoading ? 'Loading categories...' : 'Select Category'}
                                    </option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="condition">Condition *</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Condition</option>
                                    {conditions.map(condition => (
                                        <option key={condition.value} value={condition.value}>
                                            {condition.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    rows="4"
                                    placeholder="Describe your product in detail"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Availability */}
                    <div className="form-section">
                        <h2>Pricing & Availability</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="price">Price ($) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantity">Quantity Available *</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    min="0"
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="form-section">
                        <h2>Product Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="brand">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter brand name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter model number/name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="yearOfManufacture">Year of Manufacture</label>
                                <input
                                    type="number"
                                    id="yearOfManufacture"
                                    name="yearOfManufacture"
                                    value={formData.yearOfManufacture}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    placeholder="YYYY"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="color">Color</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter primary color"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="material">Material</label>
                                <input
                                    type="text"
                                    id="material"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="e.g., Metal, Plastic, Wood"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="weight">Weight</label>
                                <input
                                    type="text"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="e.g., 2.5kg, 1.2lbs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="form-section">
                        <h2>Additional Information</h2>
                        <div className="form-grid">
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="originalPackaging"
                                        checked={formData.originalPackaging}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    Original Packaging Available
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="manualIncluded"
                                        checked={formData.manualIncluded}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    Manual/Instructions Included
                                </label>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="workingConditionDesc">Working Condition Description</label>
                                <textarea
                                    id="workingConditionDesc"
                                    name="workingConditionDesc"
                                    value={formData.workingConditionDesc}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    rows="3"
                                    placeholder="Describe the current working condition, any defects, or special notes"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Addproducts;