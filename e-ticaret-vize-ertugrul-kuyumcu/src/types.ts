export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    featured: boolean;
    brand: string;
    category: string;
    stock: number;
    rating: number;
    reviewsCount: number;
    features: string[];
}