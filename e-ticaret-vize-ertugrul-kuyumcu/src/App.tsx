import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import Layout from './components/Layout';
import ProductDetail from './pages/productDetail/ProductDetail';
import HomePage from './pages/homePage/HomePage';
import AllProducts from './pages/allProductsPage/AllProductsPage';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/favoritesPage/FavoritesPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/cartPage/CartPage';

import { AuthProvider } from './context/AuthContext';
import UserRoute from './components/UserRoute';
import AdminRoute from './components/AdminRoute';
import ProfilePage from './pages/profilePage/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import AdminPage from './pages/adminPage/AdminPage';
import OrdersPage from './pages/ordersPage/OrdersPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <Routes>
                {/* Giriş Sayfası her zaman açık */}
                <Route path="/login" element={<LoginPage />} />
                <Route
                  element={
                    <UserRoute>
                      <Layout />
                    </UserRoute>
                  }
                >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<AllProducts />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/orders" element={<OrdersPage />} />

                  {/* Admin sayfası hem User hem de ekstradan AdminRoute korumasında */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    }
                  />
                </Route>

                {/* Yanlış veya bilinmeyen bir urle girilirse direkt ana sayfaya (orası da logine) atsın */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;