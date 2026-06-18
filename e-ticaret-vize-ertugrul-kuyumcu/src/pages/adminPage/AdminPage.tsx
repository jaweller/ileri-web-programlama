import { useState, useEffect } from 'react';
import {
    Button, Alert, TextField, Box,
    Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    Switch, FormControlLabel, Collapse, Badge
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Comment as CommentIcon,
    QuestionAnswer as QuestionIcon, // Soru ikonu için eklendi
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';
import api from '../../api/axiosInstance';
import type { Product } from '../../types';
import React from 'react';

const initialFormState: Product = {
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
    image: '',
    brand: '',
    featured: false,
    features: []
};

export default function AdminPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Product>(initialFormState);
    const [editMode, setEditMode] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Alt satırın hangi ürün için açıldığını ve içinin ne dolacağını tutan state'ler
    const [openProductId, setOpenProductId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'reviews' | 'questions' | null>(null);

    // Yanıt metinlerini tutan state'ler
    const [replyTexts, setReplyTexts] = useState<{ [reviewId: number]: string }>({});
    const [answerTexts, setAnswerTexts] = useState<{ [questionId: number]: string }>({});

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setDbProducts(response.data);
        } catch (error) {
            console.error("Ürünler getirilemedi:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const finalProductData = {
            ...formData,
            features: typeof formData.features === 'string'
                ? (formData.features as string).split(',').map(item => item.trim()).filter(Boolean)
                : formData.features
        };

        try {
            if (editMode && selectedProductId) {
                await api.put(`/products/${selectedProductId}`, finalProductData);
                setStatus({ type: 'success', message: 'Ürün başarıyla güncellendi!' });
            } else {
                await api.post('/products', finalProductData);
                setStatus({ type: 'success', message: 'Yeni ürün başarıyla eklendi!' });
            }

            setFormData(initialFormState);
            setEditMode(false);
            setSelectedProductId(null);
            fetchProducts();
        } catch (error: any) {
            setStatus({ type: 'error', message: 'İşlem başarısız: ' + (error.response?.data?.message || error.message) });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditMode(true);
        setSelectedProductId(product.id || null);
        setFormData({
            ...product,
            features: (Array.isArray(product.features) ? product.features.join(', ') : product.features) as any
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedProductId(null);
        setFormData(initialFormState);
    };

    const handleDeleteClick = async (id: number) => {
        if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
        try {
            setLoading(true);
            await api.delete(`/products/${id}`);
            setStatus({ type: 'success', message: 'Ürün silindi.' });
            fetchProducts();
        } catch (error: any) {
            setStatus({ type: 'error', message: 'Silme başarısız: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    // YORUM YANITLAMA (REVIEW REPLY)
    const handleSendReply = async (reviewId: number) => {
        const replyText = replyTexts[reviewId];
        if (!replyText || !replyText.trim()) return;

        try {
            setLoading(true);
            await api.post(`/reviews/${reviewId}/reply`, { reply: replyText });
            setStatus({ type: 'success', message: 'Yorum yanıtınız başarıyla kaydedildi!' });
            setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
            await fetchProducts();
        } catch (error: any) {
            setStatus({ type: 'error', message: 'Yanıt gönderilemedi: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    // SORU CEVAPLAMA (QUESTION ANSWER)
    const handleSendAnswer = async (questionId: number) => {
        const answerText = answerTexts[questionId];
        if (!answerText || !answerText.trim()) return;

        try {
            setLoading(true);
            await api.post(`/questions/${questionId}/reply`, { answer: answerText });
            setStatus({ type: 'success', message: 'Soru yanıtınız başarıyla kaydedildi!' });
            setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
            await fetchProducts();
        } catch (error: any) {
            setStatus({ type: 'error', message: 'Cevap gönderilemedi: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (productId: number, tab: 'reviews' | 'questions') => {
        if (openProductId === productId && activeTab === tab) {
            setOpenProductId(null);
            setActiveTab(null);
        } else {
            setOpenProductId(productId);
            setActiveTab(tab);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Admin Kontrol Paneli
            </Typography>

            {status && <Alert severity={status.type} sx={{ mb: 3 }}>{status.message}</Alert>}

            {/* DİNAMİK EKLEME & GÜNCELLEME FORMU */}
            <Paper component="form" onSubmit={handleFormSubmit} sx={{ p: 3, mb: 4, bgcolor: '#f9f9f9' }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="medium">
                    {editMode ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField label="Ürün Adı" required size="small" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <TextField label="Fiyat" required type="number" size="small" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                    <TextField label="Kategori" required size="small" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                    <TextField label="Stok Adedi" required type="number" size="small" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
                    <TextField label="Marka (Brand)" size="small" value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                    <TextField label="Görsel Linki (Image URL)" size="small" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                    <TextField label="Özellikler (Virgülle ayırarak yazın)" size="small" placeholder="Örn: 4K Çözünürlük, 120Hz" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value as any })} sx={{ gridColumn: '1 / -1' }} />
                    <TextField label="Açıklama" multiline rows={2} sx={{ gridColumn: '1 / -1' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <FormControlLabel control={<Switch checked={formData.featured || false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} color="primary" />} label="Öne Çıkan Ürün mü? (Featured)" sx={{ gridColumn: '1 / -1', mt: 1 }} />
                </Box>
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="contained" color={editMode ? "success" : "primary"} disabled={loading}>
                        {editMode ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
                    </Button>
                    {editMode && <Button variant="outlined" color="error" onClick={handleCancelEdit}>İptal</Button>}
                </Box>
            </Paper>

            {/* VERİTABANINDAKİ MEVCUT ÜRÜNLERİN LİSTESİ */}
            <Typography variant="h5" gutterBottom fontWeight="medium" sx={{ mt: 4 }}>
                Sistemdeki Güncel Ürünler ({dbProducts.length})
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell />
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Ürün Adı</b></TableCell>
                            <TableCell><b>Kategori</b></TableCell>
                            <TableCell align="right"><b>Fiyat</b></TableCell>
                            <TableCell align="right"><b>Stok</b></TableCell>
                            <TableCell align="center"><b>Aksiyonlar</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dbProducts.map((product) => (
                            <React.Fragment key={product.id}>
                                {/* ANA ÜRÜN SATIRI */}
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell size="small">
                                        <IconButton size="small" onClick={() => toggleRow(product.id!, activeTab || 'reviews')}>
                                            {openProductId === product.id ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell align="right">{product.price} TL</TableCell>
                                    <TableCell align="right">{product.stock}</TableCell>
                                    <TableCell align="center">
                                        {/* YORUMLAR BUTONU */}
                                        <IconButton
                                            color={openProductId === product.id && activeTab === 'reviews' ? "primary" : "secondary"}
                                            title="Yorumları Aç/Kapat"
                                            onClick={() => toggleRow(product.id!, 'reviews')}
                                        >
                                            <Badge badgeContent={product.reviews?.length || 0} color="error" max={99}>
                                                <CommentIcon />
                                            </Badge>
                                        </IconButton>

                                        {/* SORULAR BUTONU (YENİ) */}
                                        <IconButton
                                            color={openProductId === product.id && activeTab === 'questions' ? "primary" : "warning"}
                                            title="Soruları Aç/Kapat"
                                            onClick={() => toggleRow(product.id!, 'questions')}
                                        >
                                            <Badge badgeContent={(product as any).questions?.length || 0} color="info" max={99}>
                                                <QuestionIcon />
                                            </Badge>
                                        </IconButton>

                                        <IconButton color="info" onClick={() => handleEditClick(product)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(product.id!)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>

                                {/* COLLAPSIBLE ROW (DİNAMİK YORUM VEYA SORU ALANI) */}
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                        <Collapse in={openProductId === product.id} timeout="auto" unmountOnExit>

                                            {/* SEÇİLEN TAB REVIEWS İSE */}
                                            {activeTab === 'reviews' && (
                                                <Box sx={{ margin: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2, borderLeft: '4px solid #9c27b0' }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        "{product.name}" Yorum Yönetimi
                                                    </Typography>
                                                    {(!product.reviews || product.reviews.length === 0) ? (
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                                            Bu ürüne henüz kullanıcı yorumu yapılmamış.
                                                        </Typography>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                                            {product.reviews.map((review) => (
                                                                <Paper key={review.id} sx={{ p: 2, bgcolor: '#fff', boxShadow: 1 }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                                                                        {review.userName} <span style={{ color: '#ed6c02', marginLeft: '8px' }}>(★ {review.rating}/5)</span>
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 1.5 }}>"{review.comment}"</Typography>
                                                                    {review.adminReply && (
                                                                        <Box sx={{ p: 1.5, bgcolor: '#f0f4f8', borderRadius: 1, borderLeft: '3px solid #4caf50', mb: 1.5 }}>
                                                                            <Typography variant="caption" fontWeight="bold" color="success.main" display="block">Sizin Yanıtınız (Admin):</Typography>
                                                                            <Typography variant="body2">{review.adminReply}</Typography>
                                                                        </Box>
                                                                    )}
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <TextField
                                                                            label={review.adminReply ? "Yanıtı Güncelle..." : "Kullanıcıya yanıt yaz..."}
                                                                            size="small" fullWidth value={replyTexts[review.id] || ''}
                                                                            onChange={(e) => setReplyTexts({ ...replyTexts, [review.id]: e.target.value })}
                                                                        />
                                                                        <Button variant="contained" color="success" size="small" disabled={loading} onClick={() => handleSendReply(review.id)}>Gönder</Button>
                                                                    </Box>
                                                                </Paper>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}

                                            {/* SEÇİLEN TAB QUESTIONS İSE (YENİ) */}
                                            {activeTab === 'questions' && (
                                                <Box sx={{ margin: 2, p: 2, bgcolor: '#fffde7', borderRadius: 2, borderLeft: '4px solid #fbc02d' }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        "{product.name}" Müşteri Soruları
                                                    </Typography>
                                                    {(!(product as any).questions || (product as any).questions.length === 0) ? (
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                                            Bu ürün için henüz soru sorulmamış.
                                                        </Typography>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                                            {(product as any).questions.map((q: any) => (
                                                                <Paper key={q.id} sx={{ p: 2, bgcolor: '#fff', boxShadow: 1 }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" color="secondary" sx={{ mb: 1 }}>
                                                                        {q.userName || 'Kullanıcı'} sordu:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 'medium' }}>"{q.questionText}"</Typography>
                                                                    {q.adminAnswer && (
                                                                        <Box sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 1, borderLeft: '3px solid #2e7d32', mb: 1.5 }}>
                                                                            <Typography variant="caption" fontWeight="bold" color="success.main" display="block">Cevabınız (Admin):</Typography>
                                                                            <Typography variant="body2">{q.adminAnswer}</Typography>
                                                                        </Box>
                                                                    )}
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <TextField
                                                                            label={q.adminAnswer ? "Cevabı Güncelle..." : "Soruyu cevapla..."}
                                                                            size="small" fullWidth value={answerTexts[q.id] || ''}
                                                                            onChange={(e) => setAnswerTexts({ ...answerTexts, [q.id]: e.target.value })}
                                                                        />
                                                                        <Button variant="contained" color="warning" size="small" disabled={loading} onClick={() => handleSendAnswer(q.id)}>Cevapla</Button>
                                                                    </Box>
                                                                </Paper>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}

                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}