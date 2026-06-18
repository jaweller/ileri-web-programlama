import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            const user = result.user;

            // Admin e-posta kontrolü (Buradaki mail AuthContext'teki ile aynı olmalı)
            if (user.email === "admin@final.com") {
                navigate('/admin'); // Admin paneline yönlendir
            } else {
                navigate('/'); // Ana sayfaya yönlendir
            }
        } catch (error) {
            console.error("Google ile giriş yapılırken hata oluştu:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Hoş Geldiniz
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                        Güvenli bir şekilde giriş yapmak veya kayıt olmak için aşağıdaki butonu kullanabilirsiniz.
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        sx={{ py: 1.5, textTransform: 'none', fontSize: '16px', borderRadius: 2 }}
                    >
                        Google ile Giriş Yap / Kaydol
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}