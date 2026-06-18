import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Button,
    Rating,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Chip,
    CardMedia
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../api/axiosInstance';
import type { Order, OrderItem, Review } from '../../types';
import { auth } from '../../firebase';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Kullanıcının e-postası (Token veya localStorage'dan alınır)
    const userEmail = auth.currentUser?.email;

    // Değerlendirme (Review) Modal State'leri
    const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
    const [rating, setRating] = useState<number | null>(5);
    const [comment, setcomment] = useState<string>('');
    const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
    const [reviewStatus, setReviewStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Sipariş geçmişini çekme fonksiyonu
    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await api.get<Order[]>(`/orders/history?email=${userEmail}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Siparişler yüklenirken hata oluştu:', err);
            setError('Sipariş geçmişiniz yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    // 🌟 Düzenlenen Yardımcı Fonksiyon: Kullanıcının bu ürün için yaptığı yorumu bulur
    const getUserReviewForProduct = (item: OrderItem): Review | undefined => {
        return item.product?.reviews?.find(
            (r) =>
                r.userName?.toLowerCase().trim() === userEmail?.toLowerCase().trim()
        );
    };

    const handleOpenReviewModal = (item: OrderItem) => {
        setSelectedItem(item);
        setRating(5);
        setcomment('');
        setReviewStatus(null);
        setReviewModalOpen(true);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !selectedItem.product.id) return;

        try {
            setReviewSubmitting(true);
            setReviewStatus(null);

            // 🌟 Java Controller'daki alan adı "comment" ise burayı "comment: comment" yapın
            const reviewPayload = {
                rating: rating,
                comment: comment
            };

            // DOĞRU URL: /api/reviews/{productId}
            await api.post(`/reviews/${selectedItem.product.id}`, reviewPayload);

            setReviewStatus({ type: 'success', message: 'Değerlendirmeniz başarıyla kaydedildi!' });

            // State'i tazeleyelim ki buton kaybolup yorum anında listelensin
            await fetchOrderHistory();

            setTimeout(() => {
                setReviewModalOpen(false);
            }, 1200);

        } catch (err) {
            console.error('Yorum gönderilemedi:', err);
            setReviewStatus({ type: 'error', message: 'Yorum gönderilirken hata oluştu.' });
        } finally {
            setReviewSubmitting(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <CircularProgress size={50} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShoppingBagIcon color="primary" fontSize="large" />
                Sipariş Geçmişim
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6" color="text.secondary">Henüz hiç sipariş vermemişsiniz.</Typography>
                </Paper>
            ) : (
                orders.map((order) => (
                    <Paper key={order.id} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>

                        {/* Üst Bilgi Başlığı */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon fontSize="small" color="action" />
                                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                    {formatDate(order.orderDate)}
                                </Typography>
                            </Box>
                            <Chip label={`Sipariş No: #${order.id}`} variant="outlined" color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Sipariş Edilen Ürünler */}
                        {order.items.map((item) => {
                            const existingReview = getUserReviewForProduct(item);

                            return (
                                <Box key={item.id} sx={{ display: 'flex', flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center', gap: 2, py: 2, '&:not(:last-child)': { borderBottom: '1px dashed #eee' } }}>
                                    <CardMedia
                                        component="img"
                                        image={item.product?.image || 'https://via.placeholder.com/80'}
                                        alt={item.productName}
                                        sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, bgcolor: '#f5f5f5' }}
                                    />

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {item.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Adet: {item.quantity} × {item.price.toLocaleString('tr-TR')} TL
                                        </Typography>

                                        {/* 🌟 YENİLENEN ALAN: Eğer kullanıcının yorumu varsa burada gösteriyoruz */}
                                        {existingReview && (
                                            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#fdfdfd', borderRadius: 1.5, borderLeft: '3px solid #2e7d32', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Rating value={existingReview.rating} readOnly size="small" />
                                                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
                                                        <CheckCircleIcon sx={{ fontSize: 14 }} /> Değerlendirildi
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                                                    "{existingReview.comment || 'Yorumsuz puan bırakıldı.'}"
                                                </Typography>
                                                {existingReview.adminReply && (
                                                    <Box sx={{ mt: 1, pl: 1, borderLeft: '2px solid #9c27b0', bgcolor: '#faf5fb', p: 0.5, borderRadius: 1 }}>
                                                        <Typography variant="caption" display="block" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                                                            Satıcı Yanıtı:
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                                                            {existingReview.adminReply}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Box>

                                    {/* KOŞULLU BUTON ALANI: Yorum yoksa butonu göster, varsa hiçbir şey gösterme (Sadece 1 yorum hakkı) */}
                                    {!existingReview && (
                                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                startIcon={<RateReviewIcon />}
                                                onClick={() => handleOpenReviewModal(item)}
                                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                                            >
                                                Ürünü Değerlendir
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Toplam Ödenen:</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                {order.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </Typography>
                        </Box>
                    </Paper>
                ))
            )}

            {/* DEĞERLENDİRME MODALI */}
            <Dialog open={reviewModalOpen} onClose={() => !reviewSubmitting && setReviewModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Ürünü Değerlendir</DialogTitle>
                <Box component="form" onSubmit={handleReviewSubmit}>
                    <DialogContent sx={{ pt: 0 }}>
                        {selectedItem && (
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                <strong>{selectedItem.productName}</strong> ürününe puanınız ve yorumunuz:
                            </Typography>
                        )}

                        <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Rating name="product-rating" value={rating} onChange={(_e, val) => setRating(val)} size="large" precision={1} />
                        </Box>

                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Yorumunuz"
                            placeholder="Ürün hakkındaki görüşlerinizi yazın..."
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setcomment(e.target.value)}
                            disabled={reviewSubmitting}
                        />

                        {reviewStatus && <Alert severity={reviewStatus.type} sx={{ mt: 2, borderRadius: 2 }}>{reviewStatus.message}</Alert>}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={() => setReviewModalOpen(false)} color="inherit" disabled={reviewSubmitting}>İptal</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={reviewSubmitting || !rating}>Gönder</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Container>
    );
}