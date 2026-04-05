import React, { createContext, useState, useContext, type ReactNode } from 'react';

// Context'in içinde hangi verilerin olacağını tanımlıyoruz
interface FavoritesContextType {
    favorites: number[]; // Favoriye eklenen ürünlerin ID'leri
    toggleFavorite: (id: number) => void; // Ekle/Çıkar fonksiyonu
}

// Context'i oluşturuyoruz
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Uygulamamızı sarmalayacak Provider (Sağlayıcı) bileşeni
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (id: number) => {
        setFavorites((prevFavorites) =>
            // Eğer ürün zaten favorilerdeyse çıkar, yoksa ekle
            prevFavorites.includes(id)
                ? prevFavorites.filter(favId => favId !== id)
                : [...prevFavorites, id]
        );
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Bileşenlerde kolay kullanım için özel bir Hook yazıyoruz
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};