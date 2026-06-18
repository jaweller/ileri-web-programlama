import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Backend'den ürünleri çeken fonksiyon
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product[]>('/products');
        setProducts(response.data); // Gelen listeyi state'e aktar
        setError(null);
      } catch (err) {
        console.error("Ürünler çekilirken hata oluştu:", err);
        setError("Ürünler yüklenemedi. Lütfen backend uygulamasının çalıştığından emin olun.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 1. Yüklenme Durumu (Loading Spinner)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // 2. Hata Durumu
  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    );
  }

  // 3. Başarılı Listeleme Ekranı
  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Tüm Ürünler
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image || 'https://via.placeholder.com/200'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.brand} - {product.category}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: '900', mb: 2 }}>
                  {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </Typography>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Detayları Gör
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}