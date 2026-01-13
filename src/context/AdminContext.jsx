import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialProducts, initialCoupons, sampleOrders } from '../data/products';

// Initial state
const initialState = {
    isAuthenticated: false,
    admin: null,
    products: [],
    orders: [],
    coupons: [],
    analytics: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: []
    }
};

// Action types
const ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_PRODUCTS: 'SET_PRODUCTS',
    ADD_PRODUCT: 'ADD_PRODUCT',
    UPDATE_PRODUCT: 'UPDATE_PRODUCT',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_ORDERS: 'SET_ORDERS',
    ADD_ORDER: 'ADD_ORDER',
    UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
    SET_COUPONS: 'SET_COUPONS',
    ADD_COUPON: 'ADD_COUPON',
    UPDATE_COUPON: 'UPDATE_COUPON',
    DELETE_COUPON: 'DELETE_COUPON',
    UPDATE_ANALYTICS: 'UPDATE_ANALYTICS'
};

// Reducer
function adminReducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                isAuthenticated: true,
                admin: action.payload
            };

        case ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                admin: null
            };

        case ACTIONS.SET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            };

        case ACTIONS.ADD_PRODUCT:
            const newProducts = [...state.products, action.payload];
            localStorage.setItem('ss_products', JSON.stringify(newProducts));
            return {
                ...state,
                products: newProducts
            };

        case ACTIONS.UPDATE_PRODUCT:
            const updatedProducts = state.products.map(p =>
                p.id === action.payload.id ? action.payload : p
            );
            localStorage.setItem('ss_products', JSON.stringify(updatedProducts));
            return {
                ...state,
                products: updatedProducts
            };

        case ACTIONS.DELETE_PRODUCT:
            const filteredProducts = state.products.filter(p => p.id !== action.payload);
            localStorage.setItem('ss_products', JSON.stringify(filteredProducts));
            return {
                ...state,
                products: filteredProducts
            };

        case ACTIONS.SET_ORDERS:
            return {
                ...state,
                orders: action.payload
            };

        case ACTIONS.ADD_ORDER:
            const newOrders = [...state.orders, action.payload];
            localStorage.setItem('ss_orders', JSON.stringify(newOrders));
            return {
                ...state,
                orders: newOrders
            };

        case ACTIONS.UPDATE_ORDER_STATUS:
            const updatedOrders = state.orders.map(o =>
                o.id === action.payload.orderId
                    ? { ...o, status: action.payload.status }
                    : o
            );
            localStorage.setItem('ss_orders', JSON.stringify(updatedOrders));
            return {
                ...state,
                orders: updatedOrders
            };

        case ACTIONS.SET_COUPONS:
            return {
                ...state,
                coupons: action.payload
            };

        case ACTIONS.ADD_COUPON:
            const newCoupons = [...state.coupons, action.payload];
            localStorage.setItem('ss_coupons', JSON.stringify(newCoupons));
            return {
                ...state,
                coupons: newCoupons
            };

        case ACTIONS.UPDATE_COUPON:
            const updatedCoupons = state.coupons.map(c =>
                c.id === action.payload.id ? action.payload : c
            );
            localStorage.setItem('ss_coupons', JSON.stringify(updatedCoupons));
            return {
                ...state,
                coupons: updatedCoupons
            };

        case ACTIONS.DELETE_COUPON:
            const filteredCoupons = state.coupons.filter(c => c.id !== action.payload);
            localStorage.setItem('ss_coupons', JSON.stringify(filteredCoupons));
            return {
                ...state,
                coupons: filteredCoupons
            };

        case ACTIONS.UPDATE_ANALYTICS:
            return {
                ...state,
                analytics: action.payload
            };

        default:
            return state;
    }
}

// Context
const AdminContext = createContext(null);

// Provider
export function AdminProvider({ children }) {
    const [state, dispatch] = useReducer(adminReducer, initialState);

    // Load data from localStorage on mount
    useEffect(() => {
        // Check for existing admin session
        const savedSession = localStorage.getItem('ss_admin_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (session.expiresAt > Date.now()) {
                    dispatch({ type: ACTIONS.LOGIN, payload: session.admin });
                } else {
                    localStorage.removeItem('ss_admin_session');
                }
            } catch (e) {
                localStorage.removeItem('ss_admin_session');
            }
        }

        // Load products
        const savedProducts = localStorage.getItem('ss_products');
        if (savedProducts) {
            dispatch({ type: ACTIONS.SET_PRODUCTS, payload: JSON.parse(savedProducts) });
        } else {
            dispatch({ type: ACTIONS.SET_PRODUCTS, payload: initialProducts });
            localStorage.setItem('ss_products', JSON.stringify(initialProducts));
        }

        // Load orders
        const savedOrders = localStorage.getItem('ss_orders');
        if (savedOrders) {
            dispatch({ type: ACTIONS.SET_ORDERS, payload: JSON.parse(savedOrders) });
        } else {
            dispatch({ type: ACTIONS.SET_ORDERS, payload: sampleOrders });
            localStorage.setItem('ss_orders', JSON.stringify(sampleOrders));
        }

        // Load coupons
        const savedCoupons = localStorage.getItem('ss_coupons');
        if (savedCoupons) {
            dispatch({ type: ACTIONS.SET_COUPONS, payload: JSON.parse(savedCoupons) });
        } else {
            dispatch({ type: ACTIONS.SET_COUPONS, payload: initialCoupons });
            localStorage.setItem('ss_coupons', JSON.stringify(initialCoupons));
        }
    }, []);

    // Calculate analytics when orders change
    useEffect(() => {
        if (state.orders.length > 0) {
            const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = state.orders.length;
            const averageOrderValue = totalRevenue / totalOrders;

            // Calculate top products
            const productSales = {};
            state.orders.forEach(order => {
                order.items.forEach(item => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                    }
                    productSales[item.productId].quantity += item.quantity;
                    productSales[item.productId].revenue += item.price * item.quantity;
                });
            });

            const topProducts = Object.entries(productSales)
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            dispatch({
                type: ACTIONS.UPDATE_ANALYTICS,
                payload: { totalRevenue, totalOrders, averageOrderValue, topProducts }
            });
        }
    }, [state.orders]);

    // Admin login function
    const login = (username, password) => {
        // Demo credentials
        if (username === 'admin' && password === 'admin123') {
            const admin = { username: 'admin', name: 'Administrator' };
            const session = {
                admin,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            };
            localStorage.setItem('ss_admin_session', JSON.stringify(session));
            dispatch({ type: ACTIONS.LOGIN, payload: admin });
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('ss_admin_session');
        dispatch({ type: ACTIONS.LOGOUT });
    };

    // Product functions
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: `product-${Date.now()}`,
            reviews: [],
            averageRating: 0,
            reviewCount: 0
        };
        dispatch({ type: ACTIONS.ADD_PRODUCT, payload: newProduct });
        return newProduct;
    };

    const updateProduct = (product) => {
        dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: product });
    };

    const deleteProduct = (productId) => {
        dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: productId });
    };

    // Order functions
    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: `ORD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString(),
            status: 'pending'
        };
        dispatch({ type: ACTIONS.ADD_ORDER, payload: newOrder });
        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        dispatch({ type: ACTIONS.UPDATE_ORDER_STATUS, payload: { orderId, status } });
    };

    // Coupon functions
    const addCoupon = (coupon) => {
        const newCoupon = {
            ...coupon,
            id: `coupon-${Date.now()}`,
            usageCount: 0
        };
        dispatch({ type: ACTIONS.ADD_COUPON, payload: newCoupon });
        return newCoupon;
    };

    const updateCoupon = (coupon) => {
        dispatch({ type: ACTIONS.UPDATE_COUPON, payload: coupon });
    };

    const deleteCoupon = (couponId) => {
        dispatch({ type: ACTIONS.DELETE_COUPON, payload: couponId });
    };

    const validateCoupon = (code, orderTotal) => {
        const coupon = state.coupons.find(c =>
            c.code.toUpperCase() === code.toUpperCase() && c.isActive
        );

        if (!coupon) {
            return { valid: false, error: 'Invalid coupon code' };
        }

        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);

        if (now < validFrom || now > validUntil) {
            return { valid: false, error: 'Coupon has expired' };
        }

        if (orderTotal < coupon.minOrderAmount) {
            return { valid: false, error: `Minimum order amount is ₹${coupon.minOrderAmount}` };
        }

        if (coupon.usageCount >= coupon.usageLimit) {
            return { valid: false, error: 'Coupon usage limit reached' };
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (orderTotal * coupon.discountValue) / 100;
            if (discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        return { valid: true, coupon, discount };
    };

    const value = {
        ...state,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

// Hook
export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
