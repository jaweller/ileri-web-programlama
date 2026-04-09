import React from 'react';
import {
    Typography,
    Button,
    Container,
    Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

import RecommendIcon from '@mui/icons-material/Recommend';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { Product } from '../../types';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';

interface ProductSliderProps {
    title: string;
    icon: React.ReactNode;
    productsData: Product[];
    seeAllLink: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, icon, productsData, seeAllLink }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon}
                    <Typography variant="h5" component="h2" fontWeight="bold">{title}</Typography>
                </Box>
                <Button component={Link} to={seeAllLink} endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                    Tümünü Gör
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'flex', overflowX: 'auto', gap: 3, pb: 2, px: 1,
                    '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none', scrollSnapType: 'x mandatory'
                }}
            >
                {productsData.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        sx={{ minWidth: 280, maxWidth: 280, flexShrink: 0, scrollSnapAlign: 'start' }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default function HomePage() {
    const recommendedProducts = products.slice(0, 5);
    const bestSellers = products.slice(5, 10);
    const hotDeals = products.slice(10, 15);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>

            <ProductSlider
                title="Önerilenler"
                icon={<RecommendIcon color="primary" fontSize="large" />}
                productsData={recommendedProducts}
                seeAllLink="/products" 
            />

            <ProductSlider
                title="Çok Satanlar"
                icon={<TrendingUpIcon color="success" fontSize="large" />}
                productsData={bestSellers}
                seeAllLink="/products"
            />
            <ProductSlider
                title="Sıcak Teklifler"
                icon={<LocalFireDepartmentIcon color="error" fontSize="large" />}
                productsData={hotDeals}
                seeAllLink="/products"
            />

        </Container>
    );
}