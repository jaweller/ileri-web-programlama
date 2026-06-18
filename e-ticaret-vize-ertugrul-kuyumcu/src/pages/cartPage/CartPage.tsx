import { useState } from 'react';
import {
    Container, Typography, Box, Grid, Card, CardMedia, CardContent,
    IconButton, Button, Divider, Dialog, DialogTitle, DialogContent,
    TextField, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { auth } from '../../firebase';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

    // Ödeme aşaması state'leri
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Kart Form State'leri
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');

    if (paymentSuccess) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontSize: '1.1rem' }}>
                    Ödeme Başarılı! Siparişiniz Stripe güvenli ödeme ağ geçidi tarafından onaylandı. 🚀
                </Alert>
                <Typography variant="h5" gutterBottom fontWeight="bold">Teşekkür Ederiz!</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Sipariş özetiniz ve faturanız kayıtlı e-posta adresinize gönderilmiştir.
                </Typography>
                <Button component={Link} to="/products" variant="contained" color="primary">
                    Alışverişe Devam Et
                </Button>
            </Container>
        );
    }

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

    // Stripe Ödeme Tetikleyicisi Simülasyonu
    const handleStripePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderItems = cartItems.map(item => ({
            product: {
                id: item.product.id
            },
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        }));
        const userEmail = auth.currentUser?.email;
        const orderData = {
            userEmail: userEmail,
            items: orderItems
        };
        setTimeout(async () => {
            try {
                // 2.5 saniye simülasyon gecikmesinden sonra backend'e sipariş kaydı atılıyor
                const response = await api.post('/orders', orderData);

                if (response.status === 200 || response.status === 201) {
                    console.log("Sipariş başarıyla veritabanına kaydedildi:", response.data);

                    setIsProcessing(false);
                    setIsPaymentModalOpen(false);
                    setPaymentSuccess(true); // Kullanıcıya başarı ekranını gösterir

                    // Ödeme ve sipariş başarılı olduğu için sepeti temizle
                    if (typeof clearCart === 'function') {
                        clearCart();
                    }
                }
            } catch (err) {
                console.error("Sipariş oluşturulurken backend hatası meydana geldi:", err);
                alert("Ödeme simüle edildi ancak sipariş kaydı oluşturulamadı. Lütfen backend loglarını kontrol edin.");
                setIsProcessing(false);
            }
        }, 2500);
    };

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
                                    <IconButton onClick={() => updateQuantity(item.product.id!, item.quantity - 1)} size="small" color="primary">
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="body1" fontWeight="bold">{item.quantity}</Typography>
                                    <IconButton onClick={() => updateQuantity(item.product.id!, item.quantity + 1)} size="small" color="primary">
                                        <AddIcon />
                                    </IconButton>
                                </Box>

                                <IconButton onClick={() => removeFromCart(item.product.id!)} color="error">
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

                        {/* Ödeme Modalını Açan Buton */}
                        <Button
                            onClick={() => setIsPaymentModalOpen(true)}
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            startIcon={<CreditCardIcon />}
                        >
                            Sepeti Onayla ve Öde
                        </Button>
                    </Card>
                </Grid>
            </Grid>

            {/* STRIPE KREDİ KARTI ÖDEME MODALI */}
            <Dialog
                open={isPaymentModalOpen}
                onClose={() => !isProcessing && setIsPaymentModalOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon color="primary" />
                    Stripe Güvenli Ödeme
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleStripePaymentSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Ödemeniz gereken tutar: <strong style={{ color: '#2e7d32' }}>{cartTotal.toFixed(2)} TL</strong>
                        </Typography>

                        <TextField
                            required
                            fullWidth
                            label="Kart Üzerindeki İsim"
                            variant="outlined"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            disabled={isProcessing}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Kart Numarası"
                            variant="outlined"
                            inputProps={{ maxLength: 16 }}
                            placeholder="1234 5678 1234 5678"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                            disabled={isProcessing}
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="AA/YY"
                                    placeholder="12/28"
                                    inputProps={{ maxLength: 5 }}
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    disabled={isProcessing}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="CVC"
                                    placeholder="123"
                                    type="password"
                                    inputProps={{ maxLength: 3 }}
                                    value={cardCvc}
                                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                                    disabled={isProcessing}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', my: 1, color: 'text.secondary' }}>
                            <LockIcon fontSize="small" color="success" />
                            <Typography variant="caption">256-bit SSL Güvenli Altyapı</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="inherit"
                                onClick={() => setIsPaymentModalOpen(false)}
                                disabled={isProcessing}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="success"
                                disabled={isProcessing}
                            >
                                {isProcessing ? <CircularProgress size={24} color="inherit" /> : `${cartTotal.toFixed(2)} TL Öde`}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
}