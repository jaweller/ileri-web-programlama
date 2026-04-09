import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface FavoritesContextType {
    favorites: number[];
    toggleFavorite: (id: number) => void; 
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (id: number) => {
        setFavorites((prevFavorites) =>
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

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};