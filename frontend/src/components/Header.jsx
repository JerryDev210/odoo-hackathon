import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [user, setUser] = useState(authService.getCurrentUser());
    const [isMobile, setIsMobile] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Prevent body scroll when menu is open on mobile
    useEffect(() => {
        if (isMobile && isNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isNavOpen, isMobile]);

    // Check for authentication status changes
    useEffect(() => {
        const handleAuthChange = () => {
            setUser(authService.getCurrentUser());
        };

        // Listen for auth changes (you might need to implement this in authService)
        window.addEventListener('authChange', handleAuthChange);
        
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    // Load cart count
    useEffect(() => {
        loadCartCount();
        
        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCartCount();
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [user]);

    const loadCartCount = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }
        
        try {
            const response = await cartService.getCartCount();
            setCartCount(response.count || 0);
        } catch (error) {
            // Silently handle error - cart count will remain 0
            setCartCount(0);
        }
    };

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('authChange'));
        navigate('/');
    };

    return (
        <>
            <header className="header-section">
                <div className="header-content">
                    <button className="menu-toggle" onClick={toggleNav}>
                        <span className="hamburger-icon">
                            {[1, 2, 3].map(index => (
                                <span 
                                    key={`bar-${index}`} 
                                    className={`bar ${isNavOpen ? 'open' : ''}`}
                                />
                            ))}
                        </span>
                    </button>

                    <div className="logo-head">
                        <img src="/oodo_logo.png" alt="EcoFinds Logo" />
                    </div>

                    <nav className={`menu-bar ${isNavOpen ? 'open' : ''}`}>
                        <ul>
                            {[
                                { id: 'search', text: 'Search', path: '/search', alwaysShow: true },
                                { id: 'about', text: 'About', alwaysShow: true },
                                { id: 'contact', text: 'Contact', alwaysShow: true },
                                { id: 'my-listings', text: 'My Listings', path: '/my-listings', requiresAuth: true },
                                { id: 'my-purchases', text: 'My Purchases', path: '/my-purchases', requiresAuth: true },
                                { id: 'addproducts', text: 'Add Products', requiresAuth: true },
                                { id: 'logout', text: 'Logout', requiresAuth: true, onClick: handleLogout }
                            ].filter(item => item.alwaysShow || (user && item.requiresAuth))
                              .map(item => (
                                <li key={item.id}>
                                    <a 
                                        href={item.onClick ? '#' : (item.path || `/${item.id}`)} 
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                e.preventDefault();
                                                item.onClick();
                                            } else if (item.path) {
                                                e.preventDefault();
                                                navigate(item.path);
                                            }
                                            toggleNav();
                                        }}
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                            
                            {/* Mobile Auth Actions */}
                            {!user && (
                                <li className="mobile-auth-item">
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLoginRedirect();
                                            toggleNav();
                                        }}
                                    >
                                        Sign In
                                    </a>
                                </li>
                            )}
                        </ul>
                    </nav>
                    
                    <div className="header-right">
                        <button className="cart-btn" onClick={() => navigate('/cart')}>
                            <span className="cart-icon">🛒</span>
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </button>
                        {user ? (
                            <button className="profile-btn" onClick={() => navigate('/profile')}>
                                <span className="profile-icon">👤</span>
                            </button>
                        ) : (
                            <button className="auth-btn" onClick={handleLoginRedirect}>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Mobile Menu Overlay */}
                {isNavOpen && isMobile && <div className="menu-overlay" onClick={toggleNav}></div>}
            </header>
        </>
    );
};

export default Header;
