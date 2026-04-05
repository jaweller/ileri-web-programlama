import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  CardMedia, 
  Rating, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Grid
} from '@mui/material';

// İkonlar
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check'; 
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Geri dönme işlemi için
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  // Eğer ürün bulunamazsa gösterilecek ekran
  if (!product) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Ürün bulunamadı.</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Aradığınız ürün yayından kaldırılmış veya bağlantı hatalı olabilir.
        </Typography>
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>Geri Dön</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
      {/* Üst Kısım: Geri Butonu */}
      <Button 
        onClick={() => navigate(-1)} 
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 3, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
        color="inherit"
      >
        Geri Dön
      </Button>

      {/* Ana Ürün Kartı */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Grid container spacing={6}>
          
          {/* 1. SÜTUN: ÜRÜN GÖRSELİ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f8f9fa',
              position: 'relative'
            }}>
              {/* Eğer ürün "Featured" (Öne Çıkan) ise resmin üstüne bir etiket koyalım */}
              {product.featured && (
                <Chip 
                  label="Öne Çıkan" 
                  color="warning" 
                  sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 'bold' }} 
                />
              )}
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover', width: '100%', height: '100%', maxHeight: { xs: 400, md: 600 } }}
              />
            </Box>
          </Grid>
          
          {/* 2. SÜTUN: ÜRÜN DETAYLARI */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Kategori ve Marka */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={product.category} color="primary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
              <Chip label={product.brand} color="secondary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
            </Box>

            {/* Ürün Adı */}
            <Typography variant="h3" component="h1" gutterBottom fontWeight="900" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.5px' }}>
              {product.name}
            </Typography>

            {/* Yıldızlar ve Değerlendirme Sayısı */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="medium" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 0.5 }}>
                {product.rating} ({product.reviewsCount} Değerlendirme)
              </Typography>
            </Box>

            {/* Fiyat */}
            <Typography variant="h4" color="primary.main" fontWeight="900" gutterBottom sx={{ fontSize: '2.2rem' }}>
              {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </Typography>

            {/* Stok Durumu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {product.stock > 0 ? (
                <>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Stokta var ({product.stock} adet)
                  </Typography>
                </>
              ) : (
                <>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                  <Typography variant="body2" color="error.main" fontWeight="bold">
                    Tükendi
                  </Typography>
                </>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Açıklama */}
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.7 }}>
              {product.description}
            </Typography>

            {/* Teknik Özellikler Listesi */}
            <Box sx={{ mt: 1, mb: 4, flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                Öne Çıkan Özellikler:
              </Typography>
              <List dense disablePadding>
                {product.features.map((feature, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature} 
                      primaryTypographyProps={{ variant: 'body1', color: 'text.secondary', fontWeight: '500' }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Sepete Ekle Butonu */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                onClick={() => addToCart(product)}
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth
                disabled={product.stock === 0} // Stok 0 ise butonu kilitler
                startIcon={<ShoppingCartIcon />}
                sx={{ 
                  py: 1.8, 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.24)' // Butona derinlik katmak için gölge
                }}
              >
                {product.stock > 0 ? 'Sepete Ekle' : 'Geçici Olarak Temin Edilemiyor'}
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}