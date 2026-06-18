import { Container, Grid, Typography, Box } from '@mui/material';
import ProductCard from '../../components/ProductCard';
import { useFavorites } from '../../context/FavoritesContext';
import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import type { Product } from '../../types';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const favoriteProducts = products.filter(product => favorites.includes(product.id!));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>('/products');
        setProducts(response.data);
      } catch (err) {
      } finally {
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Favorilerim
      </Typography>

      {favoriteProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Typography variant="h6" color="text.secondary">
            Henüz favorilere eklediğiniz bir ürün bulunmuyor.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}