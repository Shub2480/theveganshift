import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Tag,
    ChevronRight,
    Home,
    ArrowRight,
    X,
    Check,
    Truck,
    Shield
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency } from '../utils/helpers';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    const {
        items,
        subtotal,
        discount,
        total,
        coupon,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon
    } = useCart();
    const { validateCoupon } = useAdmin();

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const handleQuantityChange = (productId, delta) => {
        const item = items.find(i => i.id === productId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty > 0) {
                updateQuantity(productId, newQty);
            }
        }
    };

    const handleApplyCoupon = () => {
        setCouponError('');
        setCouponSuccess('');

        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const result = validateCoupon(couponCode, subtotal);

        if (result.valid) {
            applyCoupon(result.coupon, result.discount);
            setCouponSuccess(`Coupon applied! You save ${formatCurrency(result.discount)}`);
            setCouponCode('');
        } else {
            setCouponError(result.error);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponSuccess('');
    };

    // Generate placeholder image
    const getPlaceholderImage = (name) => {
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return `https://via.placeholder.com/100x100/4a7c23/ffffff?text=${initials}`;
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <ShoppingCart size={60} />
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-large">
                            Start Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Shopping Cart</span>
                </nav>

                <h1 className="cart-title">Shopping Cart</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img
                                            src={item.image || getPlaceholderImage(item.name)}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = getPlaceholderImage(item.name);
                                            }}
                                        />
                                    </div>

                                    <div className="item-details">
                                        <Link to={`/products/${item.id.replace(/-\d+g?$/, '')}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <span className="item-unit">{item.unit}</span>
                                        <span className="item-price-mobile">{formatCurrency(item.price)}</span>
                                    </div>

                                    <div className="item-price">
                                        {formatCurrency(item.price)}
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>

                                    <button
                                        className="item-remove"
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <Link to="/products" className="continue-shopping">
                            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h3>Order Summary</h3>

                        {/* Coupon Section */}
                        <div className="coupon-section">
                            {!coupon ? (
                                <>
                                    <div className="coupon-input-group">
                                        <Tag size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="coupon-input"
                                        />
                                        <button
                                            className="coupon-apply-btn"
                                            onClick={handleApplyCoupon}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <div className="coupon-error">
                                            <X size={14} /> {couponError}
                                        </div>
                                    )}
                                    <div className="coupon-hint">
                                        Try <strong>WELCOME10</strong> for 10% off!
                                    </div>
                                </>
                            ) : (
                                <div className="coupon-applied">
                                    <div className="coupon-badge">
                                        <Tag size={14} />
                                        <span>{coupon.code}</span>
                                        <button onClick={handleRemoveCoupon}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                    {couponSuccess && (
                                        <div className="coupon-success">
                                            <Check size={14} /> {couponSuccess}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Summary Details */}
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal ({items.length} items)</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            {discount > 0 && (
                                <div className="summary-row discount">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout <ChevronRight size={20} />
                        </button>

                        {/* Trust Badges */}
                        <div className="cart-trust">
                            <div className="trust-item">
                                <Truck size={18} />
                                <span>Free Delivery in Mumbai</span>
                            </div>
                            <div className="trust-item">
                                <Shield size={18} />
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
