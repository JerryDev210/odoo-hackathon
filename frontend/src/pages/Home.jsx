import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import Header from '../components/Header';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const data = await categoryService.getCategories();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data && data.categories) {
                    setCategories(data.categories);
                } else {
                    console.error('Unexpected categories data format:', data);
                    setCategories([]);
                }
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories:', err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/products/${categoryId}`);
    };

    return (
        <div className="home-page">
            <Header />

            <section className="hero-section">
                <div className="hero-content">
                    <h2>Shop by Category</h2>
                    <p>Explore our wide range of product categories</p>
                </div>
                <div className="banner-img">
                    <img src="/banner/banner.png" alt="Categories banner" />
                </div>
            </section>

            <section className="categories-section">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <div 
                                key={category._id || `category-${index}`} 
                                className="category-card premium-card"
                                onClick={() => handleCategoryClick(category._id)}
                            >
                                <div className="category-content">
                                    <div className="category-header">
                                        <h3 className="category-title">{category.name || `Category ${index + 1}`}</h3>
                                        <div className="category-accent"></div>
                                    </div>
                                    <p className="category-description">
                                        {category.description || 'Discover our premium collection of quality products'}
                                    </p>
                                    <div className="category-footer">
                                        <span className="explore-text">Explore Collection</span>
                                        <div className="arrow-icon">→</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;