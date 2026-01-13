import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tag,
    LogOut,
    Leaf,
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatDate } from '../../utils/helpers';
import './Admin.css';

export default function CouponManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();

    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        isActive: true
    });

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount,
            maxDiscount: coupon.maxDiscount,
            validFrom: coupon.validFrom,
            validUntil: coupon.validUntil,
            usageLimit: coupon.usageLimit,
            isActive: coupon.isActive
        });
        setShowForm(true);
    };

    const handleDelete = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            deleteCoupon(couponId);
        }
    };

    const handleToggleActive = (coupon) => {
        updateCoupon({ ...coupon, isActive: !coupon.isActive });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const couponData = {
            ...formData,
            code: formData.code.toUpperCase(),
            discountValue: Number(formData.discountValue),
            minOrderAmount: Number(formData.minOrderAmount),
            maxDiscount: Number(formData.maxDiscount),
            usageLimit: Number(formData.usageLimit)
        };

        if (editingCoupon) {
            updateCoupon({ ...editingCoupon, ...couponData });
        } else {
            addCoupon(couponData);
        }

        setShowForm(false);
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minOrderAmount: '',
            maxDiscount: '',
            validFrom: '',
            validUntil: '',
            usageLimit: '',
            isActive: true
        });
    };

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
                    <h1>Coupon Management</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingCoupon(null);
                            setFormData({
                                code: '',
                                description: '',
                                discountType: 'percentage',
                                discountValue: '',
                                minOrderAmount: '',
                                maxDiscount: '',
                                validFrom: new Date().toISOString().split('T')[0],
                                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                usageLimit: '',
                                isActive: true
                            });
                            setShowForm(true);
                        }}
                    >
                        <Plus size={18} />
                        Add Coupon
                    </button>
                </header>

                <main className="admin-main">
                    {/* Coupon Form */}
                    {showForm && (
                        <div className="admin-form-card">
                            <h3>
                                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                                <button
                                    className="action-btn"
                                    onClick={() => setShowForm(false)}
                                    style={{ float: 'right' }}
                                >
                                    <X size={20} />
                                </button>
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="admin-form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Coupon Code *</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="e.g., SAVE20"
                                            style={{ textTransform: 'uppercase' }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Discount Type *</label>
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label className="form-label">Description *</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Brief description of the coupon"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'}) *
                                        </label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Min Order Amount (₹) *</label>
                                        <input
                                            type="number"
                                            name="minOrderAmount"
                                            value={formData.minOrderAmount}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Max Discount (₹)</label>
                                        <input
                                            type="number"
                                            name="maxDiscount"
                                            value={formData.maxDiscount}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Usage Limit *</label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={formData.usageLimit}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Valid From *</label>
                                        <input
                                            type="date"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Valid Until *</label>
                                        <input
                                            type="date"
                                            name="validUntil"
                                            value={formData.validUntil}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            id="isActive"
                                        />
                                        <label htmlFor="isActive">Active</label>
                                    </div>
                                </div>

                                <div className="admin-form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <Save size={18} />
                                        {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Coupons Table */}
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h2>All Coupons ({coupons.length})</h2>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Discount</th>
                                    <th>Min Order</th>
                                    <th>Valid Until</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon.id}>
                                        <td>
                                            <code style={{
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-700)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontWeight: '600'
                                            }}>
                                                {coupon.code}
                                            </code>
                                        </td>
                                        <td>{coupon.description}</td>
                                        <td style={{ fontWeight: '600' }}>
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}%`
                                                : `₹${coupon.discountValue}`
                                            }
                                        </td>
                                        <td>₹{coupon.minOrderAmount}</td>
                                        <td>{formatDate(coupon.validUntil)}</td>
                                        <td>
                                            {coupon.usageCount} / {coupon.usageLimit}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(coupon)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: coupon.isActive ? 'var(--color-success)' : 'var(--color-neutral-400)'
                                                }}
                                            >
                                                {coupon.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(coupon)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(coupon.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
