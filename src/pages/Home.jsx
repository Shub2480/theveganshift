import { Link } from 'react-router-dom';
import {
    Leaf,
    Heart,
    Shield,
    Truck,
    Award,
    ArrowRight,
    Star,
    ChevronRight
} from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';
import { testimonials, companyInfo } from '../data/products';
import './Home.css';

export default function Home() {
    const { products } = useAdmin();
    const featuredProducts = products.filter(p => p.featured).slice(0, 3);

    const benefits = [
        {
            icon: <Leaf size={32} />,
            title: '100% Organic',
            description: 'All our products are certified organic, grown without pesticides or chemicals.'
        },
        {
            icon: <Heart size={32} />,
            title: 'Heart Healthy',
            description: 'Zero cholesterol, low fat, and packed with plant-based protein.'
        },
        {
            icon: <Shield size={32} />,
            title: 'Quality Assured',
            description: 'Rigorous quality testing ensures every product meets our high standards.'
        },
        {
            icon: <Truck size={32} />,
            title: 'Fresh Delivery',
            description: 'Made fresh daily and delivered to your doorstep in Mumbai.'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Our Premium Products</h2>
                        <p>Discover our range of delicious, nutritious plant-based dairy alternatives</p>
                    </div>

                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} featured />
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/products" className="btn btn-secondary btn-large">
                            View All Products <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-section">
                <div className="container">
                    <div className="why-content">
                        <div className="why-text">
                            <span className="section-label">Why Choose Us</span>
                            <h2>Pure Plant Power for a Healthier You</h2>
                            <p>
                                At The Vegan Shift, we believe that healthy eating should never compromise on taste.
                                Our soya products are crafted from premium organic soybeans, providing you with
                                all the nutrition you need while being kind to the planet.
                            </p>
                            <ul className="why-list">
                                <li>
                                    <Award size={20} />
                                    <span>Made from premium organic soybeans</span>
                                </li>
                                <li>
                                    <Award size={20} />
                                    <span>No artificial preservatives or additives</span>
                                </li>
                                <li>
                                    <Award size={20} />
                                    <span>Rich in protein and essential nutrients</span>
                                </li>
                                <li>
                                    <Award size={20} />
                                    <span>Eco-friendly and sustainable production</span>
                                </li>
                            </ul>
                            <Link to="/products" className="btn btn-primary btn-large">
                                Explore Products
                            </Link>
                        </div>
                        <div className="why-image">
                            <div className="image-decoration"></div>
                            <div className="image-placeholder">
                                <Leaf size={80} />
                                <span>Pure & Natural</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-title">
                        <h2>What Our Customers Say</h2>
                        <p>Join thousands of happy customers who have made the switch to plant-based</p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < testimonial.rating ? 'currentColor' : 'none'}
                                            className={i < testimonial.rating ? 'star' : 'star-empty'}
                                        />
                                    ))}
                                </div>
                                <blockquote className="testimonial-quote">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">{testimonial.name}</span>
                                        <span className="author-role">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h2>Ready to Make the Switch?</h2>
                            <p>
                                Join the plant-based revolution. Use code <strong>WELCOME10</strong> for 10% off your first order!
                            </p>
                        </div>
                        <Link to="/products" className="btn btn-primary btn-large cta-button">
                            Shop Now <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="trust-section">
                <div className="container">
                    <div className="trust-badges">
                        <div className="trust-badge">
                            <Shield size={24} />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="trust-badge">
                            <Truck size={24} />
                            <span>Free Delivery</span>
                        </div>
                        <div className="trust-badge">
                            <Award size={24} />
                            <span>Organic Certified</span>
                        </div>
                        <div className="trust-badge">
                            <Heart size={24} />
                            <span>100% Satisfaction</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
