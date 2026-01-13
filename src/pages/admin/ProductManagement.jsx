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
    Save
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/helpers';
import './Admin.css';

export default function ProductManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, products, addProduct, updateProduct, deleteProduct } = useAdmin();

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category: 'Dairy Alternatives',
        price: '',
        originalPrice: '',
        unit: '',
        shortDescription: '',
        description: '',
        stockQuantity: '',
        featured: false
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

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || '',
            unit: product.unit,
            shortDescription: product.shortDescription,
            description: product.description,
            stockQuantity: product.stockQuantity,
            featured: product.featured
        });
        setShowForm(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
            stockQuantity: Number(formData.stockQuantity),
            inStock: Number(formData.stockQuantity) > 0,
            images: editingProduct?.images || [],
            benefits: editingProduct?.benefits || [],
            nutritionalInfo: editingProduct?.nutritionalInfo || {},
            ingredients: editingProduct?.ingredients || '',
            allergens: editingProduct?.allergens || 'Contains: Soy',
            storageInstructions: editingProduct?.storageInstructions || 'Keep refrigerated.',
            tags: ['organic', 'vegan', 'dairy-free']
        };

        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productData });
        } else {
            addProduct(productData);
        }

        setShowForm(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            slug: '',
            category: 'Dairy Alternatives',
            price: '',
            originalPrice: '',
            unit: '',
            shortDescription: '',
            description: '',
            stockQuantity: '',
            featured: false
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
                    <h1>Product Management</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: '',
                                slug: '',
                                category: 'Dairy Alternatives',
                                price: '',
                                originalPrice: '',
                                unit: '',
                                shortDescription: '',
                                description: '',
                                stockQuantity: '',
                                featured: false
                            });
                            setShowForm(true);
                        }}
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </header>

                <main className="admin-main">
                    {/* Product Form Modal */}
                    {showForm && (
                        <div className="admin-form-card">
                            <h3>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                                        <label className="form-label">Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Slug (URL) *</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="e.g., soya-milk"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        >
                                            <option value="Dairy Alternatives">Dairy Alternatives</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Proteins">Proteins</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Unit *</label>
                                        <input
                                            type="text"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="e.g., 1 Liter, 400g"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Price (₹) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Original Price (₹)</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock Quantity *</label>
                                        <input
                                            type="number"
                                            name="stockQuantity"
                                            value={formData.stockQuantity}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            id="featured"
                                        />
                                        <label htmlFor="featured">Featured Product</label>
                                    </div>

                                    <div className="form-group full-width">
                                        <label className="form-label">Short Description *</label>
                                        <input
                                            type="text"
                                            name="shortDescription"
                                            value={formData.shortDescription}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label className="form-label">Full Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <Save size={18} />
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h2>All Products ({products.length})</h2>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'var(--color-primary-100)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--color-primary-700)',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {product.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{product.name}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                                                        {product.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>
                                            <span style={{ fontWeight: '600', color: 'var(--color-primary-700)' }}>
                                                {formatCurrency(product.price)}
                                            </span>
                                            {product.originalPrice > product.price && (
                                                <span style={{
                                                    marginLeft: '0.5rem',
                                                    textDecoration: 'line-through',
                                                    color: 'var(--color-neutral-400)',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {formatCurrency(product.originalPrice)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{
                                                color: product.stockQuantity < 20 ? '#f39c12' : 'var(--color-neutral-700)'
                                            }}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${product.inStock ? 'delivered' : 'cancelled'}`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(product.id)}
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
