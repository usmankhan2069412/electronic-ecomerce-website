import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { adminApi } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast-context";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  image: string;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
}

export function AdminProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllProducts();
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      name: '',
      category: '',
      price: 0,
      discount_price: 0,
      image: '',
      in_stock: true,
      is_new: false,
      is_featured: false
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await adminApi.deleteProduct(productId);
        
        // Remove product from state
        setProducts(products.filter(p => p.id !== productId));
        
        toast({
          title: "Success",
          description: "Product deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!currentProduct) return;
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing product
        const response = await adminApi.updateProduct(currentProduct.id as string, currentProduct);
        
        // Update product in state
        setProducts(products.map(p => 
          p.id === currentProduct.id ? response.product : p
        ));
        
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        // Add new product
        const response = await adminApi.createProduct(currentProduct);
        
        // Add new product to state
        setProducts([...products, response.product]);
        
        toast({
          title: "Success",
          description: "Product added successfully"
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (!currentProduct) return;
    
    setCurrentProduct({
      ...currentProduct,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : 
              value
    });
  };

  // Add a more detailed product form with additional fields
  const renderProductForm = () => {
    if (!currentProduct) return null;
    
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Product Name</label>
            <Input
              id="name"
              name="name"
              value={currentProduct?.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Input
              id="category"
              name="category"
              value={currentProduct?.category || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">Price</label>
            <Input
              id="price"
              name="price"
              type="number"
              value={currentProduct?.price || 0}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="discount_price" className="text-sm font-medium">Discount Price (Optional)</label>
            <Input
              id="discount_price"
              name="discount_price"
              type="number"
              value={currentProduct?.discount_price || 0}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">Main Image URL</label>
          <Input
            id="image"
            name="image"
            value={currentProduct?.image || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={currentProduct?.description || ''}
            onChange={(e) => {
              if (!currentProduct) return;
              setCurrentProduct({
                ...currentProduct,
                description: e.target.value
              });
            }}
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="in_stock"
              name="in_stock"
              checked={currentProduct?.in_stock || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="in_stock" className="text-sm font-medium">In Stock</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_new"
              name="is_new"
              checked={currentProduct?.is_new || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_new" className="text-sm font-medium">New</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={currentProduct?.is_featured || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">Featured</label>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your store products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-12 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.discount_price ? (
                      <div>
                        <span className="line-through text-muted-foreground mr-2">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="font-medium">${product.discount_price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full text-center ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.is_new && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-center">
                          New
                        </span>
                      )}
                      {product.is_featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-center">
                          Featured
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the product details below.' : 'Fill in the product details below.'}
            </DialogDescription>
          </DialogHeader>
          
          {renderProductForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct}>{isEditing ? 'Update Product' : 'Add Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
