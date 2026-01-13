import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Package,
    Truck,
    Home,
    Phone,
    ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { companyInfo } from '../data/products';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    // Redirect if no order data
    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) {
        return null;
    }

    return (
        <div className="confirmation-page">
            <div className="container">
                {/* Success Header */}
                <div className="confirmation-header">
                    <div className="success-icon">
                        <CheckCircle size={60} />
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your order. We've received your order and will begin processing it shortly.</p>
                </div>

                {/* Order Details */}
                <div className="confirmation-content">
                    <div className="order-details-card">
                        <div className="order-header">
                            <div className="order-id">
                                <span className="label">Order ID</span>
                                <span className="value">{order.id}</span>
                            </div>
                            <div className="order-date">
                                <span className="label">Order Date</span>
                                <span className="value">{formatDateTime(order.date)}</span>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        <div className="order-timeline">
                            <div className="timeline-step completed">
                                <div className="step-icon">
                                    <CheckCircle size={20} />
                                </div>
                                <div className="step-info">
                                    <span className="step-title">Order Placed</span>
                                    <span className="step-desc">Your order has been received</span>
                                </div>
                            </div>
                            <div className="timeline-step">
                                <div className="step-icon">
                                    <Package size={20} />
                                </div>
                                <div className="step-info">
                                    <span className="step-title">Processing</span>
                                    <span className="step-desc">Preparing your order</span>
                                </div>
                            </div>
                            <div className="timeline-step">
                                <div className="step-icon">
                                    <Truck size={20} />
                                </div>
                                <div className="step-info">
                                    <span className="step-title">Shipped</span>
                                    <span className="step-desc">Estimated 3-5 business days</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-items-section">
                            <h3>Order Items</h3>
                            <div className="order-items-list">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-info">
                                            <span className="item-qty">{item.quantity}×</span>
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                        <span className="item-price">
                                            {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="total-row discount">
                                        <span>Discount ({order.couponCode})</span>
                                        <span>-{formatCurrency(order.discount)}</span>
                                    </div>
                                )}
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="total-row final">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="delivery-info">
                            <h3>Delivery Address</h3>
                            <p className="customer-name">{order.customer.name}</p>
                            <p className="customer-address">{order.customer.address}</p>
                            <p className="customer-phone">
                                <Phone size={14} /> {order.customer.phone}
                            </p>
                        </div>

                        {/* Payment Info */}
                        <div className="payment-info">
                            <h3>Payment Method</h3>
                            <p>Cash on Delivery (COD)</p>
                            <span className="payment-note">
                                Pay {formatCurrency(order.total)} upon delivery
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="next-steps">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>
                                <CheckCircle size={18} />
                                <span>You will receive an order confirmation message shortly</span>
                            </li>
                            <li>
                                <Package size={18} />
                                <span>We'll notify you when your order is ready for dispatch</span>
                            </li>
                            <li>
                                <Truck size={18} />
                                <span>Track your delivery with the order ID: <strong>{order.id}</strong></span>
                            </li>
                        </ul>

                        <div className="contact-support">
                            <p>Questions about your order?</p>
                            <a href={`tel:${companyInfo.phone}`} className="support-phone">
                                <Phone size={18} />
                                {companyInfo.phone}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping */}
                <div className="confirmation-actions">
                    <Link to="/" className="btn btn-secondary">
                        <Home size={18} /> Back to Home
                    </Link>
                    <Link to="/products" className="btn btn-primary">
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
