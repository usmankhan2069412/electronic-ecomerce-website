import * as React from "react";
import { useState, useEffect } from "react";
import { useRating, Rating } from "../contexts/RatingContext";
import { useAuth } from "../contexts/AuthContext";
import { Star, StarHalf } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/toast-context";

interface ProductRatingProps {
  productId: string;
}

export function ProductRatingComponent({ productId }: ProductRatingProps) {
  const { getProductRatings, submitRating, deleteRating, loading } = useRating();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Fetch ratings on component mount and when productId changes
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const productRating = await getProductRatings(productId);
        setRatings(productRating.ratings);
        setAverageScore(productRating.average_score);
        setTotalRatings(productRating.total_ratings);
        
        // Check if user has already rated this product
        if (isAuthenticated && user) {
          const existingRating = productRating.ratings.find(r => r.user_id === user.id);
          if (existingRating) {
            setUserRating(existingRating.score);
            setComment(existingRating.comment);
          } else {
            setUserRating(0);
            setComment("");
          }
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        toast({
          title: "Error",
          description: "Failed to load product ratings",
          variant: "destructive"
        });
      }
    };

    fetchRatings();
  }, [productId, isAuthenticated, user, getProductRatings]);

  const handleRatingClick = (score: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to rate this product",
        variant: "destructive"
      });
      return;
    }
    
    setUserRating(score);
  };

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to rate this product",
        variant: "destructive"
      });
      return;
    }
    
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await submitRating(productId, userRating, comment);
      
      // Refresh ratings after submission
      const productRating = await getProductRatings(productId);
      setRatings(productRating.ratings);
      setAverageScore(productRating.average_score);
      setTotalRatings(productRating.total_ratings);
      
      toast({
        title: "Success",
        description: "Your rating has been submitted"
      });
      
      setShowRatingForm(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit your rating",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    try {
      await deleteRating(ratingId);
      
      // Refresh ratings after deletion
      const productRating = await getProductRatings(productId);
      setRatings(productRating.ratings);
      setAverageScore(productRating.average_score);
      setTotalRatings(productRating.total_ratings);
      
      // Reset user rating
      setUserRating(0);
      setComment("");
      
      toast({
        title: "Success",
        description: "Your rating has been deleted"
      });
    } catch (error) {
      console.error("Failed to delete rating:", error);
      toast({
        title: "Error",
        description: "Failed to delete your rating",
        variant: "destructive"
      });
    }
  };

  // Render stars for a given rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400 h-5 w-5" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="fill-yellow-400 text-yellow-400 h-5 w-5" />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-gray-300 h-5 w-5" />
      );
    }
    
    return stars;
  };

  // Render interactive stars for rating input
  const renderRatingInput = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => handleRatingClick(score)}
            className="focus:outline-none"
          >
            <Star 
              className={`h-6 w-6 ${
                score <= userRating 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex">{renderStars(averageScore)}</div>
          <span className="font-medium">{averageScore.toFixed(1)}</span>
          <span className="text-muted-foreground">({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})</span>
        </div>
        
        {isAuthenticated && (
          <Button 
            variant="outline" 
            onClick={() => setShowRatingForm(!showRatingForm)}
            className="mt-2 md:mt-0"
          >
            {showRatingForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
      </div>
      
      {showRatingForm && (
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>Share your experience with this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Rating</div>
              {renderRatingInput()}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">Comment (Optional)</label>
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmitRating} disabled={isSubmitting || userRating === 0}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        
        {ratings.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">{rating.username}</div>
                    <div className="flex">{renderStars(rating.score)}</div>
                  </div>
                  
                  {isAuthenticated && user && user.id === rating.user_id && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteRating(rating.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {new Date(rating.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{rating.comment || "No comment provided."}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
