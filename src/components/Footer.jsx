import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Leaf,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Send,
    Heart,
    ArrowRight
} from 'lucide-react';
import { companyInfo } from '../data/products';
import './Footer.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // Store newsletter signup
            const subscribers = JSON.parse(localStorage.getItem('ss_newsletter') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('ss_newsletter', JSON.stringify(subscribers));
            }
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Our Products' },
        { path: '/products/soya-milk', label: 'Soya Milk' },
        { path: '/products/soya-curd', label: 'Soya Curd' },
        { path: '/products/soya-paneer', label: 'Soya Paneer' },
        { path: '/contact', label: 'Contact Us' }
    ];

    const supportLinks = [
        { path: '/contact', label: 'Help Center' },
        { path: '/contact', label: 'Shipping Info' },
        { path: '/contact', label: 'Returns Policy' },
        { path: '/contact', label: 'FAQ' }
    ];

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer-newsletter">
                <div className="container newsletter-content">
                    <div className="newsletter-text">
                        <h3>Get Healthy Recipes & Exclusive Offers</h3>
                        <p>Subscribe to our newsletter for vegan recipes, health tips, and special discounts.</p>
                    </div>
                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <div className="newsletter-input-wrapper">
                            <Mail size={18} className="newsletter-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="newsletter-input"
                            />
                            <button type="submit" className="newsletter-btn">
                                {subscribed ? 'Subscribed!' : <><Send size={18} /> Subscribe</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container footer-grid">
                    {/* Company Info */}
                    <div className="footer-section footer-about">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <Leaf size={24} />
                            </div>
                            <div className="footer-logo-text">
                                <span className="footer-logo-name">{companyInfo.name}</span>
                                <span className="footer-logo-tagline">{companyInfo.tagline}</span>
                            </div>
                        </div>
                        <p className="footer-description">
                            We are committed to bringing you the finest organic, plant-based dairy alternatives.
                            Made fresh in Mumbai with love and care for your health and the planet.
                        </p>
                        <div className="footer-social">
                            <a
                                href={companyInfo.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href={companyInfo.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href={companyInfo.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Twitter"
                            >
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="footer-link">
                                        <ArrowRight size={14} />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h4 className="footer-title">Support</h4>
                        <ul className="footer-links">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="footer-link">
                                        <ArrowRight size={14} />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section footer-contact">
                        <h4 className="footer-title">Contact Us</h4>
                        <div className="contact-items">
                            <a href={`tel:${companyInfo.phone}`} className="contact-item">
                                <div className="contact-icon">
                                    <Phone size={18} />
                                </div>
                                <div className="contact-text">
                                    <span className="contact-label">Call Us</span>
                                    <span className="contact-value">{companyInfo.phone}</span>
                                </div>
                            </a>
                            <a href={`mailto:${companyInfo.email}`} className="contact-item">
                                <div className="contact-icon">
                                    <Mail size={18} />
                                </div>
                                <div className="contact-text">
                                    <span className="contact-label">Email</span>
                                    <span className="contact-value">{companyInfo.email}</span>
                                </div>
                            </a>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <MapPin size={18} />
                                </div>
                                <div className="contact-text">
                                    <span className="contact-label">Address</span>
                                    <span className="contact-value">{companyInfo.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p className="copyright">
                        © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
                    </p>
                    <p className="made-with">
                        Made with <Heart size={14} className="heart-icon" /> for a healthier planet
                    </p>
                </div>
            </div>
        </footer>
    );
}
