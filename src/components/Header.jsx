import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    Leaf,
    Phone,
    ChevronDown
} from 'lucide-react';
import { companyInfo } from '../data/products';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const { totalItems } = useCart();
    const { products } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setShowSearch(false);
    }, [location]);

    // Search functionality
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    // Search suggestions
    const searchSuggestions = searchQuery.length >= 2
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="header-top">
                <div className="container header-top-content">
                    <div className="header-top-left">
                        <Leaf size={14} />
                        <span>100% Organic & Plant-Based</span>
                    </div>
                    <div className="header-top-right">
                        <a href={`tel:${companyInfo.phone}`} className="header-phone">
                            <Phone size={14} />
                            <span>{companyInfo.phone}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="container header-content">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <div className="logo-icon">
                            <Leaf size={28} />
                        </div>
                        <div className="logo-text">
                            <span className="logo-name">The Vegan Shift</span>
                            <span className="logo-tagline">Pure Plant Power</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header-nav desktop-nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <form className="header-search desktop-search" onSubmit={handleSearch}>
                        <div className="search-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchSuggestions.length > 0 && (
                                <div className="search-suggestions">
                                    {searchSuggestions.map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.slug}`}
                                            className="suggestion-item"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <img src={product.images[0]} alt={product.name} />
                                            <div className="suggestion-info">
                                                <span className="suggestion-name">{product.name}</span>
                                                <span className="suggestion-price">₹{product.price}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Header Actions */}
                    <div className="header-actions">
                        {/* Search Toggle - Mobile */}
                        <button
                            className="action-btn mobile-search-toggle"
                            onClick={() => setShowSearch(!showSearch)}
                            aria-label="Search"
                        >
                            <Search size={22} />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="action-btn cart-btn">
                            <ShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems}</span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="action-btn menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {showSearch && (
                    <div className="mobile-search">
                        <form onSubmit={handleSearch}>
                            <div className="search-wrapper">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                    autoFocus
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* Mobile Navigation */}
                <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-content">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mobile-nav-divider"></div>
                        <Link to="/admin" className="mobile-nav-link admin-link">
                            Admin Panel
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="mobile-nav-overlay"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </>
    );
}
