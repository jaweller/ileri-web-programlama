import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Badge,
  Tooltip
} from '@mui/material';

// İkonlar
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Marka ikonu

// Context'leri çağırıyoruz (Rozetler için)
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Context'lerden sayıları çekiyoruz
  const { cartCount } = useCart();
  const { favorites } = useFavorites();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerItems = [
    { text: 'Ana Sayfa', icon: <HomeIcon />, path: '/' },
    { text: 'Tüm Ürünler', icon: <StorefrontIcon />, path: '/products' },
    { text: 'Sepetim', icon: <ShoppingCartIcon />, path: '/cart', count: cartCount },
    { text: 'Favorilerim', icon: <FavoriteIcon />, path: '/favorites', count: favorites.length },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* 1. MODERN NAVBAR (Üst Menü) */}
      <AppBar position="sticky" elevation={3}> {/* sticky ile sayfa kayarken menü üstte kalır */}
        <Toolbar>
          {/* Mobil Menü Butonu (Sol Tarafta) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo ve Başlık */}
          <StorefrontIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: '900',
              letterSpacing: '.1rem'
            }}
          >
            E-TİCARET
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

            <Tooltip title="Favorilerim">
              <IconButton color="inherit" component={Link} to="/favorites">
                <Badge badgeContent={favorites.length} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Sepetim">
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. SIDEBAR (Yan Menü - Drawer) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, pt: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorefrontIcon /> Menü
          </Typography>
          <List>
            {drawerItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {/* Drawer içindeki ikonlara da rozet ekledik */}
                    {item.count !== undefined && item.count > 0 ? (
                      <Badge badgeContent={item.count} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 3. ANA İÇERİK */}
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        <Outlet />
      </Box>

      {/* 4. FOOTER */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center" fontWeight="500">
            © 2026 Tüm Hakları Saklıdır. Vize Projesi. Ertuğrul Kuyumcu
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}