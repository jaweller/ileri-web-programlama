import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Sayfaları ve yeni Layout'umuzu içe aktarıyoruz
import Layout from './components/Layout';
import ProductDetail from './pages/productDetail/ProductDetail';
import HomePage from './pages/homePage/HomePage';
import AllProducts from './pages/allProductsPage/AllProductsPage';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/favoritesPage/FavoritesPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/cartPage/cartPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <FavoritesProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Route>
            </Routes>
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;