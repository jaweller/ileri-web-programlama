export interface Product {
    id?: number;
    name: string;
    price: number;
    description: string;
    image: string;
    featured: boolean;
    brand: string;
    category: string;
    stock: number;
    rating?: number;
    reviewsCount?: number;
    features: string[];
    reviews?: Review[];
    questions?: Question[]; // Ürüne ait soruların dizisi buraya eklendi
}

export interface Review {
    id: number;
    userName: string;
    comment: string;
    rating: number;
    createdAt?: string;
    adminReply?: string;
}

// Yeni eklenen Question interface'i
export interface Question {
    id: number;
    userName: string;       // Soruyu soran kullanıcının adı
    questionText: string;   // Sorulan soru metni
    adminAnswer?: string;   // Adminin (satıcının) verdiği cevap (isteğe bağlı/opsiyonel)
    createdAt?: string;     // Sorunun oluşturulma tarihi (eğer backend'den dönüyorsa)
}
export interface Order {
    id?: number;
    userEmail: string;
    totalAmount: number;
    orderDate?: string;
    items: OrderItem[];
}

export interface OrderItem {
    id?: number;
    product: Product;
    productName: string;
    quantity: number;
    price: number;
}