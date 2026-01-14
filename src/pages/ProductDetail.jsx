import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Plus,
    Minus,
    Check,
    ChevronRight,
    Home,
    Leaf,
    Facebook,
    Twitter,
    Linkedin,
    ZoomIn,
    X
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency, calculateDiscountPercentage, formatDate, getAssetUrl } from '../utils/helpers';
import './ProductDetail.css';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { products } = useAdmin();
    const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showZoom, setShowZoom] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [addedToCart, setAddedToCart] = useState(false);

    // Find product
    useEffect(() => {
        const found = products.find(p => p.slug === slug);
        if (found) {
            setProduct(found);
            // Update document title for SEO
            document.title = `${found.name} - The Vegan Shift | Organic Vegan Products`;
        } else if (products.length > 0) {
            navigate('/products');
        }
    }, [slug, products, navigate]);

    // Add structured data for product SEO
    useEffect(() => {
        if (!product) return;

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.shortDescription,
            "image": product.images?.[0] || `https://theveganshift.com/images/${product.slug}-1.jpg`,
            "brand": {
                "@type": "Brand",
                "name": "The Vegan Shift"
            },
            "sku": product.id,
            "category": product.category,
            "offers": {
                "@type": "Offer",
                "url": `https://theveganshift.com/products/${product.slug}`,
                "priceCurrency": "INR",
                "price": product.price,
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "The Vegan Shift"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.averageRating,
                "reviewCount": product.reviewCount
            }
        };

        // Add reviews if available
        if (product.reviews?.length > 0) {
            structuredData.review = product.reviews.map(r => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": r.author },
                "datePublished": r.date,
                "reviewBody": r.comment,
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": r.rating,
                    "bestRating": 5
                }
            }));
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'product-structured-data';
        script.textContent = JSON.stringify(structuredData);

        // Remove existing and add new
        const existing = document.getElementById('product-structured-data');
        if (existing) existing.remove();
        document.head.appendChild(script);

        return () => {
            const elem = document.getElementById('product-structured-data');
            if (elem) elem.remove();
            document.title = 'The Vegan Shift | Organic Vegan Soya Products';
        };
    }, [product]);

    if (!product) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    const discountPercent = calculateDiscountPercentage(product.originalPrice, product.price);
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);
    const inCart = isInCart(product.id);
    const cartQuantity = getItemQuantity(product.id);

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleQuantityChange = (delta) => {
        const newQty = Math.max(1, quantity + delta);
        setQuantity(newQty);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out ${product.name} from The Vegan Shift!`;

        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    // Generate placeholder image
    const getPlaceholderImage = (index = 0) => {
        const colors = ['4a7c23', '2d5016', '5a9c2a', '3a6b1c'];
        const color = colors[index % colors.length];
        return `https://via.placeholder.com/600x600/${color}/ffffff?text=${product.name.split(' ')[0]}`;
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to="/products" className="breadcrumb-link">Products</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                {/* Product Main Section */}
                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img
                                src={product.images?.[selectedImage] ? getAssetUrl(product.images[selectedImage]) : getPlaceholderImage(selectedImage)}
                                alt={product.name}
                                className="main-image"
                                onClick={() => setShowZoom(true)}
                                onError={(e) => {
                                    e.target.src = getPlaceholderImage(selectedImage);
                                }}
                            />
                            <button
                                className="zoom-btn"
                                onClick={() => setShowZoom(true)}
                            >
                                <ZoomIn size={20} />
                            </button>

                            {/* Badges */}
                            <div className="image-badges">
                                {discountPercent > 0 && (
                                    <span className="badge badge-sale">-{discountPercent}%</span>
                                )}
                                <span className="badge badge-organic">
                                    <Leaf size={12} /> Organic
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="image-thumbnails">
                            {(product.images?.length > 0 ? product.images : [1, 2, 3]).map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={typeof img === 'string' ? getAssetUrl(img) : getPlaceholderImage(index)}
                                        alt={`${product.name} view ${index + 1}`}
                                        onError={(e) => {
                                            e.target.src = getPlaceholderImage(index);
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        {/* Rating */}
                        <div className="product-rating">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        className={star <= Math.round(product.averageRating) ? 'star' : 'star-empty'}
                                        fill={star <= Math.round(product.averageRating) ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                            <span className="rating-text">
                                {product.averageRating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="product-price-section">
                            <span className="current-price">{formatCurrency(product.price)}</span>
                            {product.originalPrice > product.price && (
                                <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                            )}
                            <span className="price-unit">/ {product.unit}</span>
                        </div>

                        {/* Short Description */}
                        <p className="product-short-desc">{product.shortDescription}</p>

                        {/* Benefits */}
                        <div className="product-benefits">
                            {product.benefits?.slice(0, 4).map((benefit, index) => (
                                <div key={index} className="benefit-item">
                                    <Check size={16} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                    <Minus size={18} />
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                className={`btn btn-cart ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check size={20} />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {inCart && (
                            <div className="in-cart-notice">
                                <Check size={16} />
                                <span>{cartQuantity} in your cart</span>
                                <Link to="/cart">View Cart</Link>
                            </div>
                        )}

                        {/* Social Share */}
                        <div className="social-share">
                            <span>Share:</span>
                            <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
                                <Facebook size={18} />
                            </button>
                            <button onClick={() => handleShare('twitter')} aria-label="Share on Twitter">
                                <Twitter size={18} />
                            </button>
                            <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn">
                                <Linkedin size={18} />
                            </button>
                        </div>

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.inStock ? (
                                <span className="in-stock">
                                    <Check size={16} /> In Stock ({product.stockQuantity} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">Out of Stock</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
                            onClick={() => setActiveTab('nutrition')}
                        >
                            Nutritional Info
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviewCount})
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'description' && (
                            <div className="tab-pane">
                                <div className="description-content">
                                    {product.description.split('\n\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>

                                <div className="additional-info">
                                    <div className="info-item">
                                        <h4>Ingredients</h4>
                                        <p>{product.ingredients}</p>
                                    </div>
                                    <div className="info-item">
                                        <h4>Allergens</h4>
                                        <p>{product.allergens}</p>
                                    </div>
                                    <div className="info-item">
                                        <h4>Storage Instructions</h4>
                                        <p>{product.storageInstructions}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'nutrition' && (
                            <div className="tab-pane">
                                <div className="nutrition-table">
                                    <h4>Nutritional Information</h4>
                                    <p className="serving-size">Serving Size: {product.nutritionalInfo?.servingSize}</p>
                                    <table>
                                        <tbody>
                                            {product.nutritionalInfo && Object.entries(product.nutritionalInfo).map(([key, value]) => {
                                                if (key === 'servingSize') return null;
                                                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                                return (
                                                    <tr key={key}>
                                                        <td>{label}</td>
                                                        <td>{value}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-pane reviews-tab">
                                <div className="reviews-summary">
                                    <div className="rating-big">
                                        <span className="rating-number">{product.averageRating}</span>
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={20}
                                                    className={star <= Math.round(product.averageRating) ? 'star' : 'star-empty'}
                                                    fill={star <= Math.round(product.averageRating) ? 'currentColor' : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <span className="rating-count">Based on {product.reviewCount} reviews</span>
                                    </div>
                                </div>

                                <div className="reviews-list">
                                    {product.reviews?.map(review => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">
                                                        {review.author.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="reviewer-name">{review.author}</span>
                                                        {review.verified && (
                                                            <span className="verified-badge">
                                                                <Check size={12} /> Verified Purchase
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="review-date">{formatDate(review.date)}</span>
                                            </div>
                                            <div className="review-rating">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= review.rating ? 'star' : 'star-empty'}
                                                        fill={star <= review.rating ? 'currentColor' : 'none'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>You May Also Like</h2>
                        <div className="related-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Image Zoom Modal */}
            {showZoom && (
                <div className="zoom-modal" onClick={() => setShowZoom(false)}>
                    <button className="zoom-close" onClick={() => setShowZoom(false)}>
                        <X size={24} />
                    </button>
                    <img
                        src={product.images?.[selectedImage] ? getAssetUrl(product.images[selectedImage]) : getPlaceholderImage(selectedImage)}
                        alt={product.name}
                        onClick={(e) => e.stopPropagation()}
                        onError={(e) => {
                            e.target.src = getPlaceholderImage(selectedImage);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
