import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, Home } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';
import './Products.css';

export default function Products() {
    const { products } = useAdmin();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('featured');

    // Filter and sort products
    useEffect(() => {
        let result = [...products];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        setFilteredProducts(result);
    }, [products, searchQuery, sortBy]);

    // Update URL when search changes
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Our Products</h1>
                    <p>Discover our range of organic, plant-based dairy alternatives</p>
                </div>
            </div>

            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Products</span>
                </nav>

                {/* Filters Bar */}
                <div className="filters-bar">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>

                    <div className="sort-filter">
                        <Filter size={18} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Results Info */}
                <div className="results-info">
                    <span>
                        {searchQuery
                            ? `${filteredProducts.length} results for "${searchQuery}"`
                            : `${filteredProducts.length} products`
                        }
                    </span>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="products-grid-page">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Search size={40} />
                        </div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search to find what you're looking for.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSearchQuery('');
                                setSearchParams({});
                            }}
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
