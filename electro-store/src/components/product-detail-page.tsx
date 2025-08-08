import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProductRatingComponent } from "./product-rating";
import { useToast } from "./ui/toast-context";
import { productApi } from "@/services/api";
import { Heart, ShoppingCart, Check } from "lucide-react";
import api from "@/services/api";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  colors: string[];
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(false);
        
        // Fetch product from API
        const productData = await productApi.getProduct(id);
        
        setProduct(productData.product);
        setSelectedImage(productData.product.image);
        if (productData.product.colors && productData.product.colors.length > 0) {
          setSelectedColor(productData.product.colors[0]);
        }
        
        // Fetch related products
        const relatedResponse = await productApi.getProducts({ category: productData.product.category });
        // Filter out the current product from related products
        const filteredRelated = relatedResponse.products.filter(p => p.id !== id);
        setRelatedProducts(filteredRelated.slice(0, 4)); // Limit to 4 related products
        
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(true);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image,
      quantity: quantity
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
    
    setIsAddingToCart(false);
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!product) return;
    
    try {
      setIsAddingToWishlist(true);
      
      // API call to add to wishlist
      await api.post("/orders/wishlist", {
        product_id: product.id
      });
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Error loading product</h1>
        <p className="text-gray-600 mb-6">There was a problem fetching the product details.</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="mb-6 text-gray-600">The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
          
          <div className="flex space-x-2 overflow-auto pb-2">
            <div
              className={`cursor-pointer border rounded-md overflow-hidden ${
                selectedImage === product.image ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(product.image)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 object-cover"
              />
            </div>
            
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border rounded-md overflow-hidden ${
                  selectedImage === image ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="h-20 w-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.category}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {product.discount_price ? (
              <>
                <span className="text-2xl font-bold">${product.discount_price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Description</p>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Color</p>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full border ${
                      selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </Button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-10 border rounded-md text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.in_stock}
            >
              {isAddingToCart ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : product.in_stock ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
            >
              {isAddingToWishlist ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                  Adding...
                </div>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className={`flex items-center ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
              {product.in_stock ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  In Stock
                </>
              ) : (
                "Out of Stock"
              )}
            </div>
            
            {product.is_new && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                New
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <Tabs defaultValue="features" className="mt-10">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="py-4">
          <ul className="list-disc pl-5 space-y-2">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="specifications" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="py-4">
          <ProductRatingComponent productId={product.id} />
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {relatedProduct.discount_price ? (
                        <div className="flex items-center space-x-1">
                          <span className="font-bold">${relatedProduct.discount_price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">${relatedProduct.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
