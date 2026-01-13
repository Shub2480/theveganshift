import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
    items: [],
    coupon: null,
    discount: 0
};

// Action types
const ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON',
    CLEAR_CART: 'CLEAR_CART',
    LOAD_CART: 'LOAD_CART'
};

// Reducer
function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_ITEM: {
            const existingIndex = state.items.findIndex(item => item.id === action.payload.id);

            let newItems;
            if (existingIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
            }

            localStorage.setItem('ss_cart', JSON.stringify(newItems));
            return { ...state, items: newItems };
        }

        case ACTIONS.REMOVE_ITEM: {
            const newItems = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('ss_cart', JSON.stringify(newItems));
            return {
                ...state,
                items: newItems,
                // Reset coupon if cart becomes empty
                coupon: newItems.length === 0 ? null : state.coupon,
                discount: newItems.length === 0 ? 0 : state.discount
            };
        }

        case ACTIONS.UPDATE_QUANTITY: {
            const { id, quantity } = action.payload;

            if (quantity <= 0) {
                const newItems = state.items.filter(item => item.id !== id);
                localStorage.setItem('ss_cart', JSON.stringify(newItems));
                return { ...state, items: newItems };
            }

            const newItems = state.items.map(item =>
                item.id === id ? { ...item, quantity } : item
            );
            localStorage.setItem('ss_cart', JSON.stringify(newItems));
            return { ...state, items: newItems };
        }

        case ACTIONS.APPLY_COUPON:
            return {
                ...state,
                coupon: action.payload.coupon,
                discount: action.payload.discount
            };

        case ACTIONS.REMOVE_COUPON:
            return {
                ...state,
                coupon: null,
                discount: 0
            };

        case ACTIONS.CLEAR_CART:
            localStorage.removeItem('ss_cart');
            return initialState;

        case ACTIONS.LOAD_CART:
            return {
                ...state,
                items: action.payload
            };

        default:
            return state;
    }
}

// Context
const CartContext = createContext(null);

// Provider
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('ss_cart');
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart);
                dispatch({ type: ACTIONS.LOAD_CART, payload: items });
            } catch (e) {
                localStorage.removeItem('ss_cart');
            }
        }
    }, []);

    // Calculate totals
    const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 0 : 0; // Free shipping
    const total = subtotal - state.discount + shipping;

    // Actions
    const addItem = (product, quantity = 1) => {
        dispatch({
            type: ACTIONS.ADD_ITEM,
            payload: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '/images/placeholder.jpg',
                unit: product.unit,
                quantity
            }
        });
    };

    const removeItem = (productId) => {
        dispatch({ type: ACTIONS.REMOVE_ITEM, payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
    };

    const applyCoupon = (coupon, discount) => {
        dispatch({ type: ACTIONS.APPLY_COUPON, payload: { coupon, discount } });
    };

    const removeCoupon = () => {
        dispatch({ type: ACTIONS.REMOVE_COUPON });
    };

    const clearCart = () => {
        dispatch({ type: ACTIONS.CLEAR_CART });
    };

    const isInCart = (productId) => {
        return state.items.some(item => item.id === productId);
    };

    const getItemQuantity = (productId) => {
        const item = state.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const value = {
        items: state.items,
        coupon: state.coupon,
        discount: state.discount,
        subtotal,
        shipping,
        total,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Hook
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
