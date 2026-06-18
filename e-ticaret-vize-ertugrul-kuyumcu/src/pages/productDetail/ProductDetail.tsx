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
  Grid,
  CircularProgress,
  TextField,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RateReviewIcon from '@mui/icons-material/RateReview';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import api from '../../api/axiosInstance';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Soru sorma form state'leri
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [questionSubmitting, setQuestionSubmitting] = useState<boolean>(false);
  const [questionStatus, setQuestionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get<Product>(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error("Ürün detayı getirilirken hata oluştu:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Yeni Soru Gönderme Fonksiyonu
  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setQuestionSubmitting(true);
      setQuestionStatus(null);

      // Backend'deki @PostMapping("/{productId}") endpoint'ine istek atıyoruz
      await api.post(`/questions/${id}`, { questionText: newQuestion });

      setNewQuestion('');
      setQuestionStatus({ type: 'success', message: 'Sorunuz başarıyla iletildi! Admin cevabından sonra listelenecektir.' });

      // Sayfayı güncelle
      fetchProductDetail();
    } catch (err: any) {
      console.error("Soru gönderilemedi:", err);
      setQuestionStatus({
        type: 'error',
        message: 'Soru gönderilemedi. Lütfen giriş yaptığınızdan emin olun.'
      });
    } finally {
      setQuestionSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="body1" color="text.secondary" fontWeight="medium">
          Ürün detayları yükleniyor...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
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
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
        color="inherit"
      >
        Geri Dön
      </Button>

      {/* ÜRÜN ANA KARTI */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 5 }}>
        <Grid container spacing={6}>
          {/* ÜRÜN GÖRSELİ */}
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

          {/* ÜRÜN BİLGİLERİ */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={product.category} color="primary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
              <Chip label={product.brand} color="secondary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Typography variant="h3" component="h1" gutterBottom fontWeight="900" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.5px' }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="medium" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 0.5 }}>
                {product.rating} ({product.reviewsCount || 0} Değerlendirme)
              </Typography>
            </Box>

            <Typography variant="h4" color="primary.main" fontWeight="900" gutterBottom sx={{ fontSize: '2.2rem' }}>
              {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </Typography>

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

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.7 }}>
              {product.description}
            </Typography>

            <Box sx={{ mt: 1, mb: 4, flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                Öne Çıkan Özellikler:
              </Typography>
              <List dense disablePadding>
                {product.features && product.features.map((feature, index) => (
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

            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button
                onClick={() => addToCart(product)}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={product.stock === 0}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  py: 1.8,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.24)'
                }}
              >
                {product.stock > 0 ? 'Sepete Ekle' : 'Geçici Olarak Temin Edilemiyor'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* QUESTIONS VE REVIEWS ALANI */}
      <Grid container spacing={4}>

        {/* SOL TARAF: QUESTIONS (SORULAR) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <HelpOutlineIcon color="primary" />
              <Typography variant="h5" fontWeight="bold">Ürün Soruları</Typography>
            </Box>

            {/* Soru Sorma Formu */}
            <Box component="form" onSubmit={handleSendQuestion} sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Satıcıya bu ürün hakkında bir soru sor..."
                variant="outlined"
                multiline
                rows={3}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Örn: Kutu içeriğinde kılıf çıkıyor mu?"
                disabled={questionSubmitting}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={questionSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={questionSubmitting || !newQuestion.trim()}
              >
                Soruyu Gönder
              </Button>

              {questionStatus && (
                <Alert severity={questionStatus.type} sx={{ mt: 2, borderRadius: 2 }}>
                  {questionStatus.message}
                </Alert>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Soruların Listelenmesi */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
              {product.questions && product.questions.length > 0 ? (
                product.questions.map((q) => (
                  <Paper key={q.id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      <HelpOutlineIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                          {q.userName || 'Kullanıcı'}:
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {q.questionText}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Admin Cevabı (adminAnswer) */}
                    {q.adminAnswer ? (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1.5, pl: 2, borderLeft: '3px solid #1976d2' }}>
                        <QuestionAnswerIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                            Satıcı Cevabı:
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {q.adminAnswer}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1, pl: 4 }}>
                        Henüz cevaplanmadı.
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                  Bu ürün için henüz soru sorulmamış.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* SAĞ TARAF: REVIEWS (DEĞERLENDİRMELER / YORUMLAR) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <RateReviewIcon color="success" />
              <Typography variant="h5" fontWeight="bold">Müşteri Değerlendirmeleri</Typography>
            </Box>

            <Box sx={{ overflowY: 'auto', maxHeight: 550, flexGrow: 1 }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <Box key={review.id} sx={{ mb: 3, p: 2, borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountCircleIcon color="action" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {/* ÖNEMLİ: Java'da userName olarak setlendiği için review.userName yazılmalı */}
                          {review.userName || review.username || 'Müşteri'}
                        </Typography>
                      </Box>
                      <Rating value={review.rating || 5} size="small" readOnly />
                    </Box>

                    {/* ÖNEMLİ: Java'dan comment veya comment dönebilir, ikisini de kontrol ediyoruz */}
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 4, lineHeight: 1.6 }}>
                      {review.comment || review.comment || "Kullanıcı yorum bırakmadı, sadece puan verdi."}
                    </Typography>

                    {/* EĞER ADMİN CEVABI VARSA ONU DA BURADA GÖSTERELİM */}
                    {review.adminReply && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1.5, pl: 4, borderLeft: '3px solid #9c27b0' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">
                            Satıcı Yanıtı:
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {review.adminReply}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 8 }}>
                  Bu ürüne henüz değerlendirme yapılmamış.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}