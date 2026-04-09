import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material'; 
import type { Product } from '../types';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

    const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleCloseToast = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return; 
        setToastOpen(false);
    };

    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { product, quantity }];
        });
        showToast(`${product.name} sepete eklendi!`, 'success');
    };

    const removeFromCart = (productId: number) => {
        setCartItems((prevItems) => {
            const itemToRemove = prevItems.find(item => item.product.id === productId);
            if (itemToRemove) {
                showToast(`${itemToRemove.product.name} sepetten çıkarıldı.`, 'info');
            }
            return prevItems.filter((item) => item.product.id !== productId);
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount }}>
            {children}
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000} 
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
            >
                <Alert onClose={handleCloseToast} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart CartProvider ile birlikte kullanılmalıdır!!');
    }
    return context;
};