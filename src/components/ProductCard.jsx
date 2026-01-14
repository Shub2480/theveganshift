import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateDiscountPercentage, getAssetUrl } from '../utils/helpers';
import './ProductCard.css';

export default function ProductCard({ product, featured = false }) {
    const { addItem, isInCart } = useCart();

    const discountPercent = calculateDiscountPercentage(
        product.originalPrice,
        product.price
    );

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    // Generate placeholder image with product initials
    const getPlaceholderImage = () => {
        const colors = ['4a7c23', '2d5016', '5a9c2a'];
        const color = colors[product.id?.charCodeAt(0) % colors.length] || '4a7c23';
        const initials = product.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        return `https://via.placeholder.com/400x400/${color}/ffffff?text=${initials}`;
    };

    return (
        <Link
            to={`/products/${product.slug}`}
            className={`product-card ${featured ? 'featured' : ''}`}
        >
            {/* Image Container */}
            <div className="product-card-image">
                <img
                    src={product.images?.[0] ? getAssetUrl(product.images[0]) : getPlaceholderImage()}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = getPlaceholderImage();
                    }}
                />

                {/* Badges */}
                <div className="product-badges">
                    {discountPercent > 0 && (
                        <span className="badge badge-sale">-{discountPercent}%</span>
                    )}
                    <span className="badge badge-organic">
                        <Leaf size={12} /> Organic
                    </span>
                </div>

                {/* Quick Add Button */}
                <button
                    className={`quick-add-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                    onClick={handleAddToCart}
                    aria-label={isInCart(product.id) ? 'Added to cart' : 'Add to cart'}
                >
                    <ShoppingCart size={18} />
                    <span>{isInCart(product.id) ? 'Added' : 'Add'}</span>
                </button>
            </div>

            {/* Content */}
            <div className="product-card-content">
                {/* Category */}
                <span className="product-category">{product.category}</span>

                {/* Title */}
                <h3 className="product-title">{product.name}</h3>

                {/* Rating */}
                <div className="product-rating">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={14}
                                className={star <= Math.round(product.averageRating) ? 'star' : 'star-empty'}
                                fill={star <= Math.round(product.averageRating) ? 'currentColor' : 'none'}
                            />
                        ))}
                    </div>
                    <span className="rating-count">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="product-price">
                    <span className="current-price">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                    )}
                    <span className="unit">/ {product.unit}</span>
                </div>

                {/* Description */}
                <p className="product-short-desc">{product.shortDescription}</p>
            </div>
        </Link>
    );
}
