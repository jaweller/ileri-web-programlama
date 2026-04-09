import { Container, Grid, Typography, Box } from '@mui/material';
import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';
import { useFavorites } from '../../context/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

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