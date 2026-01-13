import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tag,
    LogOut,
    Leaf,
    Eye,
    X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import './Admin.css';

export default function OrderManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, orders, updateOrderStatus } = useAdmin();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const navLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/products', label: 'Products', icon: <Package size={20} /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
        { path: '/admin/coupons', label: 'Coupons', icon: <Tag size={20} /> },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <Leaf size={20} />
                        </div>
                        <div className="sidebar-logo-text">
                            <span className="sidebar-logo-name">SS Food</span>
                            <span className="sidebar-logo-label">Admin Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}

                    <div className="sidebar-divider"></div>

                    <Link to="/" className="sidebar-link">
                        <Leaf size={20} />
                        View Store
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-content">
                <header className="admin-header">
                    <h1>Order Management</h1>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['all', 'pending', 'shipped', 'delivered'].map(status => (
                            <button
                                key={status}
                                className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilterStatus(status)}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="admin-main">
                    {/* Order Details Modal */}
                    {selectedOrder && (
                        <div className="admin-form-card">
                            <h3>
                                Order Details: {selectedOrder.id}
                                <button
                                    className="action-btn"
                                    onClick={() => setSelectedOrder(null)}
                                    style={{ float: 'right' }}
                                >
                                    <X size={20} />
                                </button>
                            </h3>

                            <div className="admin-form-grid">
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Customer Information</h4>
                                    <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                    {selectedOrder.customer.email && (
                                        <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                    )}
                                    <p><strong>Address:</strong> {selectedOrder.customer.address}</p>
                                </div>

                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Order Status</h4>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => {
                                            handleStatusChange(selectedOrder.id, e.target.value);
                                            setSelectedOrder({ ...selectedOrder, status: e.target.value });
                                        }}
                                        className="form-input"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <p><strong>Order Date:</strong> {formatDateTime(selectedOrder.date)}</p>
                                    <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                                    {selectedOrder.notes && (
                                        <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                                    )}
                                </div>

                                <div className="full-width">
                                    <h4 style={{ marginBottom: '0.5rem' }}>Order Items</h4>
                                    <table className="admin-table" style={{ marginBottom: '1rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>{formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div style={{ textAlign: 'right' }}>
                                        <p>Subtotal: {formatCurrency(selectedOrder.subtotal)}</p>
                                        {selectedOrder.discount > 0 && (
                                            <p style={{ color: 'var(--color-success)' }}>
                                                Discount ({selectedOrder.couponCode}): -{formatCurrency(selectedOrder.discount)}
                                            </p>
                                        )}
                                        <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                            Total: {formatCurrency(selectedOrder.total)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Table */}
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h2>Orders ({filteredOrders.length})</h2>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="order-id-cell">{order.id}</td>
                                            <td>{formatDateTime(order.date)}</td>
                                            <td>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{order.customer.name}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                                                        {order.customer.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{order.items.length} items</td>
                                            <td style={{ fontWeight: '600' }}>{formatCurrency(order.total)}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`status-badge ${order.status}`}
                                                    style={{
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '0.25rem 0.75rem'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
