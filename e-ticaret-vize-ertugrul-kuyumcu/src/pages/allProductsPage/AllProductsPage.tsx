import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';

export default function AllProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const categories = useMemo(() => {
    const allCats = products.map(p => p.category);
    return ['all', ...Array.from(new Set(allCats))];
  }, []);

  const brands = useMemo(() => {
    const allBrands = products.map(p => p.brand);
    return ['all', ...Array.from(new Set(allBrands))];
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(a.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('default');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>

      <Typography variant="h4" component="h1" fontWeight="900" sx={{ mb: 4 }}>
        Tüm Ürünler
      </Typography>

      <Box sx={{
        p: 3,
        mb: 4,
        bgcolor: '#f8f9fa',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAltIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Filtrele ve Sırala</Typography>
          {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchTerm !== '') && (
            <Chip
              label="Filtreleri Temizle"
              onClick={resetFilters}
              onDelete={resetFilters}
              size="small"
              color="error"
              variant="outlined"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ürün adı ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ backgroundColor: 'white' }}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategori"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat === 'all' ? 'Tüm Kategoriler' : cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
              <InputLabel>Marka</InputLabel>
              <Select
                value={selectedBrand}
                label="Marka"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map(brand => (
                  <MenuItem key={brand} value={brand}>
                    {brand === 'all' ? 'Tüm Markalar' : brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortBy}
                label="Sırala"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="default">Varsayılan</MenuItem>
                <MenuItem value="price-asc">Fiyat (Artan)</MenuItem>
                <MenuItem value="price-desc">Fiyat (Azalan)</MenuItem>
                <MenuItem value="name-asc">İsim (A-Z)</MenuItem>
                <MenuItem value="name-desc">İsim (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight="500">
          {sortedAndFilteredProducts.length} ürün listeleniyor
        </Typography>
      </Box>

      {sortedAndFilteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Sonuç bulunamadı.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lütfen farklı bir filtre kombinasyonu deneyin.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedAndFilteredProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

    </Container>
  );
}