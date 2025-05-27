import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast-context";
import { Pencil, Trash2, UserPlus } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role: string;
  created_at: string;
}

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real application, this would be an actual API call
        // For now, we'll simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockUsers = [
          { id: 'u1', username: 'john_doe', email: 'john@example.com', first_name: 'John', last_name: 'Doe', role: 'user', created_at: '2025-04-15T10:30:00Z' },
          { id: 'u2', username: 'jane_smith', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', role: 'user', created_at: '2025-04-20T14:45:00Z' },
          { id: 'u3', username: 'mike_jones', email: 'mike@example.com', first_name: 'Mike', last_name: 'Jones', role: 'user', created_at: '2025-04-25T09:15:00Z' },
          { id: 'u4', username: 'sarah_connor', email: 'sarah@example.com', first_name: 'Sarah', last_name: 'Connor', role: 'user', created_at: '2025-05-01T16:20:00Z' },
          { id: 'u5', username: 'alex_wilson', email: 'alex@example.com', first_name: 'Alex', last_name: 'Wilson', role: 'user', created_at: '2025-05-05T11:10:00Z' },
          { id: 'u6', username: 'emma_davis', email: 'emma@example.com', first_name: 'Emma', last_name: 'Davis', role: 'user', created_at: '2025-05-10T13:25:00Z' },
          { id: 'u7', username: 'robert_brown', email: 'robert@example.com', first_name: 'Robert', last_name: 'Brown', role: 'user', created_at: '2025-05-15T08:40:00Z' },
          { id: 'admin', username: 'admin', email: 'admin@example.com', first_name: 'Admin', last_name: 'User', role: 'admin', created_at: '2025-04-01T00:00:00Z' },
        ];
        
        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setCurrentEditUser({...user});
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    setCurrentEditUser({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: 'user',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    // Prevent deleting current user or the main admin
    if (userId === currentUser?.id || userId === 'admin') {
      toast({
        title: "Error",
        description: "You cannot delete this user account",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // In a real application, this would be an actual API call
        // For now, we'll simulate the deletion
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove user from state
        setUsers(users.filter(u => u.id !== userId));
        
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveUser = async () => {
    if (!currentEditUser) return;
    
    try {
      // In a real application, this would be an actual API call
      // For now, we'll simulate the save
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentEditUser.id) {
        // Update existing user
        setUsers(users.map(u => 
          u.id === currentEditUser.id ? { ...u, ...currentEditUser } as User : u
        ));
        
        toast({
          title: "Success",
          description: "User updated successfully"
        });
      } else {
        // Add new user
        const newUser = {
          ...currentEditUser,
          id: `u${Date.now()}`, // Generate a temporary ID
          created_at: new Date().toISOString()
        } as User;
        
        setUsers([...users, newUser]);
        
        toast({
          title: "Success",
          description: "User added successfully"
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (!currentEditUser) return;
    
    setCurrentEditUser({
      ...currentEditUser,
      [name]: value
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
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
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'Not set'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditUser(user)}
                        disabled={user.id === 'admin' && currentUser?.id !== 'admin'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id || user.id === 'admin'}
                      >
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
            <DialogTitle>{currentEditUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {currentEditUser?.id ? 'Update the user details below.' : 'Fill in the user details below.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first_name" className="text-sm font-medium">First Name</label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={currentEditUser?.first_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={currentEditUser?.last_name || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                name="username"
                value={currentEditUser?.username || ''}
                onChange={handleInputChange}
                disabled={!!currentEditUser?.id} // Disable username editing for existing users
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentEditUser?.email || ''}
                onChange={handleInputChange}
              />
            </div>
            
            {!currentEditUser?.id && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <select
                id="role"
                name="role"
                value={currentEditUser?.role || 'user'}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentEditUser?.id === 'admin'} // Prevent changing admin role
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="avatar" className="text-sm font-medium">Avatar URL (Optional)</label>
              <Input
                id="avatar"
                name="avatar"
                value={currentEditUser?.avatar || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>{currentEditUser?.id ? 'Update User' : 'Add User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
