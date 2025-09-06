import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import { cartService } from "../services/cartService";
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await cartService.getCart();
            setCartItems(response.items || []);
            
            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            setError(err.message || 'Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await cartService.updateCartItem(productId, newQuantity);
            setCartItems(items =>
                items.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            
            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            setError(err.message || 'Failed to update quantity');
        }
    };

    const removeItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            setCartItems(items => items.filter(item => item.product.id !== productId));
            
            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            setError(err.message || 'Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setCartItems([]);
            
            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            setError(err.message || 'Failed to clear cart');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0).toFixed(2);
    };

    const calculateSubtotal = (price, quantity) => {
        return (price * quantity).toFixed(2);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setCheckoutLoading(true);
        
        try {
            const response = await cartService.checkout(shippingAddress, 'cash_on_delivery');
            alert('Order placed successfully! Order ID: ' + response.orderId);
            setCartItems([]);
            setShowCheckoutModal(false);
            setShippingAddress({
                fullName: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                phone: ''
            });
            
            // Dispatch cart updated event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            setError(err.message || 'Checkout failed');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="cart-page">
                <Header />
                <div className="cart-container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Header />
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    {cartItems.length > 0 && (
                        <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Add items to your cart to see them here.</p>
                        <button className="continue-shopping-btn" onClick={() => window.history.back()}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="cart-item">
                                    <div className="item-image">
                                        <img 
                                            src={item.product.image || '/placeholder-product.jpg'} 
                                            alt={item.product.name}
                                        />
                                    </div>
                                    
                                    <div className="item-details">
                                        <h3>{item.product.name}</h3>
                                        <p className="item-description">{item.product.description}</p>
                                        <div className="item-meta">
                                            <span className="item-category">
                                                Category: {item.product.category}
                                            </span>
                                            <span className="item-price">
                                                ${item.product.price.toFixed(2)} each
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="item-controls">
                                        <div className="quantity-controls">
                                            <button 
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button 
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="item-subtotal">
                                            ${calculateSubtotal(item.product.price, item.quantity)}
                                        </div>
                                        
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeItem(item.product.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Items ({cartItems.length})</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                                <button 
                                    className="checkout-btn"
                                    onClick={() => setShowCheckoutModal(true)}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout Modal */}
                {showCheckoutModal && (
                    <div className="modal-overlay">
                        <div className="checkout-modal">
                            <div className="modal-header">
                                <h2>Checkout</h2>
                                <button 
                                    className="close-btn"
                                    onClick={() => setShowCheckoutModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <form onSubmit={handleCheckout}>
                                <div className="shipping-section">
                                    <h3>Shipping Address</h3>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={shippingAddress.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Address"
                                            value={shippingAddress.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={shippingAddress.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="ZIP Code"
                                            value={shippingAddress.zipCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="payment-section">
                                    <h3>Payment Method</h3>
                                    <div className="payment-option">
                                        <input type="radio" id="cod" name="payment" value="cod" defaultChecked />
                                        <label htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                </div>

                                <div className="checkout-summary">
                                    <div className="summary-row">
                                        <span>Total Amount</span>
                                        <span className="total-amount">${calculateTotal()}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="place-order-btn"
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;