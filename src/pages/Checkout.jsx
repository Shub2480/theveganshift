import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Home,
    User,
    Phone,
    Mail,
    MapPin,
    Truck,
    Shield,
    CreditCard,
    Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency, isValidEmail, isValidPhone } from '../utils/helpers';
import './Checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, subtotal, discount, total, coupon, clearCart } = useCart();
    const { addOrder } = useAdmin();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: 'Mumbai',
        pincode: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Delivery address is required';
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate order processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create order
        const order = addOrder({
            customer: {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                address: `${formData.address}, ${formData.city} - ${formData.pincode}`
            },
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            discount,
            couponCode: coupon?.code || null,
            shipping: 0,
            total,
            paymentMethod: 'COD',
            notes: formData.notes
        });

        // Clear cart and redirect
        clearCart();
        navigate('/order-confirmation', { state: { order } });
    };

    // Redirect if cart is empty
    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to="/cart" className="breadcrumb-link">Cart</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Checkout</span>
                </nav>

                <h1 className="checkout-title">Checkout</h1>

                <div className="checkout-layout">
                    {/* Checkout Form */}
                    <div className="checkout-form-section">
                        <form onSubmit={handleSubmit}>
                            {/* Contact Information */}
                            <div className="form-section">
                                <h3 className="form-section-title">
                                    <User size={20} />
                                    Contact Information
                                </h3>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <span className="form-error">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <Phone size={14} /> Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.phone ? 'error' : ''}`}
                                            placeholder="+91 98765 43210"
                                        />
                                        {errors.phone && <span className="form-error">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <Mail size={14} /> Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="form-section">
                                <h3 className="form-section-title">
                                    <MapPin size={20} />
                                    Delivery Address
                                </h3>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label className="form-label">Street Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className={`form-input form-textarea ${errors.address ? 'error' : ''}`}
                                            placeholder="House/Flat No., Building Name, Street, Landmark"
                                            rows={3}
                                        />
                                        {errors.address && <span className="form-error">{errors.address}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Mumbai"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.pincode ? 'error' : ''}`}
                                            placeholder="400001"
                                            maxLength={6}
                                        />
                                        {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="form-section">
                                <h3 className="form-section-title">
                                    <CreditCard size={20} />
                                    Additional Information
                                </h3>

                                <div className="form-group">
                                    <label className="form-label">Order Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="form-input form-textarea"
                                        placeholder="Any special instructions for delivery..."
                                        rows={2}
                                    />
                                </div>

                                {/* Payment Method */}
                                <div className="payment-method">
                                    <h4>Payment Method</h4>
                                    <div className="payment-option selected">
                                        <Check size={18} />
                                        <span>Cash on Delivery (COD)</span>
                                    </div>
                                    <p className="payment-note">
                                        Pay when your order is delivered. No advance payment required.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button - Mobile */}
                            <button
                                type="submit"
                                className="place-order-btn mobile-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>Place Order • {formatCurrency(total)}</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>

                        <div className="order-items">
                            {items.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="order-item-info">
                                        <span className="order-item-qty">{item.quantity}×</span>
                                        <span className="order-item-name">{item.name}</span>
                                    </div>
                                    <span className="order-item-price">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            {discount > 0 && (
                                <div className="total-row discount">
                                    <span>Discount ({coupon?.code})</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            <div className="total-row">
                                <span>Shipping</span>
                                <span className="free">FREE</span>
                            </div>

                            <div className="total-row final">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            form="checkout-form"
                            className="place-order-btn desktop-submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Shield size={18} />
                                    Place Order
                                </>
                            )}
                        </button>

                        {/* Shipping Info */}
                        <div className="shipping-info">
                            <Truck size={18} />
                            <div>
                                <strong>Free Standard Delivery</strong>
                                <span>Estimated delivery: 3-5 business days</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="checkout-trust">
                            <div className="trust-badge">
                                <Shield size={16} />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="trust-badge">
                                <Check size={16} />
                                <span>100% Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
