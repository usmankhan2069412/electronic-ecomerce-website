import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast-context";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export function AdminCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real application, this would be an actual API call
        // For now, we'll simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockCategories = [
          { id: 'c1', name: 'Smartphones', image: '/images/categories/smartphones.jpg', description: 'Latest smartphones with cutting-edge technology' },
          { id: 'c2', name: 'Audio', image: '/images/categories/audio.jpg', description: 'High-quality audio devices for immersive sound experience' },
          { id: 'c3', name: 'Wearables', image: '/images/categories/wearables.jpg', description: 'Smart wearable devices to track your fitness and health' },
          { id: 'c4', name: 'Power Banks', image: '/images/categories/powerbanks.jpg', description: 'Portable power solutions for your devices on the go' },
          { id: 'c5', name: 'Accessories', image: '/images/categories/accessories.jpg', description: 'Essential accessories for your electronic devices' },
        ];
        
        setCategories(mockCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditCategory = (category: Category) => {
    setCurrentCategory({...category});
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddCategory = () => {
    setCurrentCategory({
      name: '',
      image: '',
      description: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        // In a real application, this would be an actual API call
        // For now, we'll simulate the deletion
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove category from state
        setCategories(categories.filter(c => c.id !== categoryId));
        
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!currentCategory) return;
    
    try {
      // In a real application, this would be an actual API call
      // For now, we'll simulate the save
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditing) {
        // Update existing category
        setCategories(categories.map(c => 
          c.id === currentCategory.id ? { ...c, ...currentCategory } as Category : c
        ));
        
        toast({
          title: "Success",
          description: "Category updated successfully"
        });
      } else {
        // Add new category
        const newCategory = {
          ...currentCategory,
          id: `c${Date.now()}` // Generate a temporary ID
        } as Category;
        
        setCategories([...categories, newCategory]);
        
        toast({
          title: "Success",
          description: "Category added successfully"
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!currentCategory) return;
    
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
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
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="h-12 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditCategory(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteCategory(category.id)}>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the category details below.' : 'Fill in the category details below.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Category Name</label>
              <Input
                id="name"
                name="name"
                value={currentCategory?.name || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL</label>
              <Input
                id="image"
                name="image"
                value={currentCategory?.image || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={currentCategory?.description || ''}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>{isEditing ? 'Update Category' : 'Add Category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
