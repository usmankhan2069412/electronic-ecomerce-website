import * as React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Define rating types
export interface Rating {
  id: string;
  product_id: string;
  user_id: string;
  username: string;
  score: number;
  comment: string;
  created_at: string;
}

export interface ProductRating {
  average_score: number;
  total_ratings: number;
  ratings: Rating[];
}

// Define rating context type
interface RatingContextType {
  getProductRatings: (productId: string) => Promise<ProductRating>;
  submitRating: (productId: string, score: number, comment: string) => Promise<void>;
  deleteRating: (ratingId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Create rating context
const RatingContext = createContext<RatingContextType | undefined>(undefined);

// Rating provider component
export const RatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get product ratings
  const getProductRatings = async (productId: string): Promise<ProductRating> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data based on product ID
      const mockRatings: Rating[] = [
        {
          id: `r1-${productId}`,
          product_id: productId,
          user_id: 'u1',
          username: 'john_doe',
          score: 4,
          comment: 'Great product, works as expected!',
          created_at: '2025-05-20T10:30:00Z'
        },
        {
          id: `r2-${productId}`,
          product_id: productId,
          user_id: 'u2',
          username: 'jane_smith',
          score: 5,
          comment: 'Absolutely love it! Best purchase ever.',
          created_at: '2025-05-18T14:45:00Z'
        },
        {
          id: `r3-${productId}`,
          product_id: productId,
          user_id: 'u3',
          username: 'mike_jones',
          score: 3,
          comment: 'Good but could be better. Battery life is shorter than expected.',
          created_at: '2025-05-15T09:15:00Z'
        }
      ];
      
      // Calculate average score
      const totalScore = mockRatings.reduce((sum, rating) => sum + rating.score, 0);
      const averageScore = mockRatings.length > 0 ? totalScore / mockRatings.length : 0;
      
      const productRating: ProductRating = {
        average_score: parseFloat(averageScore.toFixed(1)),
        total_ratings: mockRatings.length,
        ratings: mockRatings
      };
      
      return productRating;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ratings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit a new rating
  const submitRating = async (productId: string, score: number, comment: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, the backend would save this rating
      console.log('Rating submitted:', { productId, score, comment });
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a rating
  const deleteRating = async (ratingId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, the backend would delete this rating
      console.log('Rating deleted:', ratingId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete rating');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    getProductRatings,
    submitRating,
    deleteRating,
    loading,
    error
  };

  return <RatingContext.Provider value={value}>{children}</RatingContext.Provider>;
};

// Custom hook to use rating context
export const useRating = () => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
};
