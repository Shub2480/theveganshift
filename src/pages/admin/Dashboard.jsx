import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tag,
    LogOut,
    Leaf,
    TrendingUp,
    DollarSign,
    Users,
    AlertTriangle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/helpers';
import './Admin.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, analytics, orders, products, admin } = useAdmin();

    // Redirect if not authenticated
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

    // Recent orders
    const recentOrders = orders.slice(-5).reverse();

    // Low stock products
    const lowStockProducts = products.filter(p => p.stockQuantity < 20);

    // Order status counts
    const orderStatusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

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
                    <h1>Dashboard</h1>
                    <div className="admin-user">
                        <span>Welcome, {admin?.name}</span>
                        <div className="admin-avatar">A</div>
                    </div>
                </header>

                <main className="admin-main">
                    {/* Stats Cards */}
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon green">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <div className="stat-value">{formatCurrency(analytics.totalRevenue)}</div>
                            <div className="stat-label">Total Revenue</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon blue">
                                    <ShoppingCart size={24} />
                                </div>
                            </div>
                            <div className="stat-value">{analytics.totalOrders}</div>
                            <div className="stat-label">Total Orders</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon orange">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <div className="stat-value">{formatCurrency(analytics.averageOrderValue)}</div>
                            <div className="stat-label">Avg. Order Value</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <div className="stat-icon purple">
                                    <Package size={24} />
                                </div>
                            </div>
                            <div className="stat-value">{products.length}</div>
                            <div className="stat-label">Total Products</div>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="dashboard-grid">
                        {/* Recent Orders */}
                        <div className="dashboard-card">
                            <h3>Recent Orders</h3>
                            {recentOrders.length > 0 ? (
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className="order-id-cell">{order.id}</td>
                                                <td>{order.customer.name}</td>
                                                <td>{formatCurrency(order.total)}</td>
                                                <td>
                                                    <span className={`status-badge ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted">No orders yet</p>
                            )}
                            <Link to="/admin/orders" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                                View All Orders
                            </Link>
                        </div>

                        {/* Top Products & Alerts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Top Products */}
                            <div className="dashboard-card">
                                <h3>Top Products</h3>
                                <div className="top-products">
                                    {analytics.topProducts.slice(0, 3).map((product, index) => (
                                        <div key={product.id} className="top-product-item">
                                            <div className={`product-rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="product-info">
                                                <span className="product-name">{product.name}</span>
                                                <span className="product-sales">{product.quantity} sold</span>
                                            </div>
                                            <span className="product-revenue">{formatCurrency(product.revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Low Stock Alert */}
                            {lowStockProducts.length > 0 && (
                                <div className="dashboard-card" style={{ background: 'rgba(243, 156, 18, 0.05)' }}>
                                    <h3 style={{ color: '#f39c12' }}>
                                        <AlertTriangle size={20} style={{ marginRight: '0.5rem' }} />
                                        Low Stock Alert
                                    </h3>
                                    <div className="top-products">
                                        {lowStockProducts.map(product => (
                                            <div key={product.id} className="top-product-item">
                                                <div className="product-info">
                                                    <span className="product-name">{product.name}</span>
                                                    <span className="product-sales" style={{ color: '#f39c12' }}>
                                                        Only {product.stockQuantity} left
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Status Summary */}
                            <div className="dashboard-card">
                                <h3>Order Status</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Pending</span>
                                        <span className="status-badge pending">{orderStatusCounts.pending || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Shipped</span>
                                        <span className="status-badge shipped">{orderStatusCounts.shipped || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Delivered</span>
                                        <span className="status-badge delivered">{orderStatusCounts.delivered || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
