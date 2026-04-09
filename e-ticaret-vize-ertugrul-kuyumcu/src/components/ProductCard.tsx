import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import type { Product } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
    sx?: SxProps<Theme>;
}

export default function ProductCard({ product, sx }: ProductCardProps) {
    const { favorites, toggleFavorite } = useFavorites();
    const { addToCart } = useCart(); 

    const isFavorite = favorites.includes(product.id);

    return (
        <Card
            sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                transition: '0.3s', position: 'relative',
                '&:hover': { transform: 'scale(1.02)', boxShadow: 6 }, ...sx
            }}
        >
            <IconButton
                onClick={() => toggleFavorite(product.id)}
                sx={{
                    position: 'absolute', top: 8, right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                }}
            >
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="action" />}
            </IconButton>

            <CardMedia component="img" height="200" image={product.image} alt={product.name} sx={{ objectFit: 'cover' }} />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        {product.price} TL
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            color="primary"
                            onClick={() => addToCart(product)}
                            sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}
                            size="small"
                            title="Sepete Ekle"
                        >
                            <AddShoppingCartIcon fontSize="small" />
                        </IconButton>

                        <Button component={Link} to={`/product/${product.id}`} variant="contained" size="small">
                            İncele
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}