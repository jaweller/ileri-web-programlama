import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, IconButton, Button, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Sepetiniz şu an boş.</Typography>
                <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
                    Alışverişe Başla
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                Sepetim
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    {cartItems.map((item) => (
                        <Card key={item.product.id} sx={{ display: 'flex', mb: 2, p: 1, alignItems: 'center' }}>
                            <CardMedia component="img" image={item.product.image} alt={item.product.name} sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }} />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">{item.product.name}</Typography>
                                    <Typography color="primary" fontWeight="bold">{item.product.price} TL</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton onClick={() => updateQuantity(item.product.id, item.quantity - 1)} size="small" color="primary">
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="body1" fontWeight="bold">{item.quantity}</Typography>
                                    <IconButton onClick={() => updateQuantity(item.product.id, item.quantity + 1)} size="small" color="primary">
                                        <AddIcon />
                                    </IconButton>
                                </Box>

                                <IconButton onClick={() => removeFromCart(item.product.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Sipariş Özeti</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Ara Toplam</Typography>
                            <Typography variant="body1">{cartTotal.toFixed(2)} TL</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Kargo</Typography>
                            <Typography variant="body1" color="success.main">Ücretsiz</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Toplam</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">{cartTotal.toFixed(2)} TL</Typography>
                        </Box>
                        <Button variant="contained" color="success" fullWidth size="large">
                            Sepeti Onayla
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}