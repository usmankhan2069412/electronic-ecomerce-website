import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast-context";
import { Badge } from "../ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Order {
  id: string;
  user_id: string;
  username: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

export function AdminOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real application, this would be an actual API call
        // For now, we'll simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockOrders = [
          { id: 'ord123', user_id: 'u1', username: 'john_doe', status: 'delivered', payment_status: 'completed', total_amount: 129.99, created_at: '2025-05-25T14:23:45Z' },
          { id: 'ord124', user_id: 'u2', username: 'jane_smith', status: 'processing', payment_status: 'completed', total_amount: 249.99, created_at: '2025-05-25T10:15:22Z' },
          { id: 'ord125', user_id: 'u3', username: 'mike_jones', status: 'pending', payment_status: 'pending', total_amount: 89.99, created_at: '2025-05-24T18:45:12Z' },
          { id: 'ord126', user_id: 'u4', username: 'sarah_connor', status: 'shipped', payment_status: 'completed', total_amount: 199.99, created_at: '2025-05-24T09:30:55Z' },
          { id: 'ord127', user_id: 'u5', username: 'alex_wilson', status: 'pending', payment_status: 'pending', total_amount: 349.99, created_at: '2025-05-23T16:20:33Z' },
          { id: 'ord128', user_id: 'u1', username: 'john_doe', status: 'cancelled', payment_status: 'refunded', total_amount: 79.99, created_at: '2025-05-22T11:10:18Z' },
          { id: 'ord129', user_id: 'u6', username: 'emma_davis', status: 'delivered', payment_status: 'completed', total_amount: 159.99, created_at: '2025-05-21T14:55:42Z' },
          { id: 'ord130', user_id: 'u7', username: 'robert_brown', status: 'delivered', payment_status: 'completed', total_amount: 299.99, created_at: '2025-05-20T08:40:27Z' },
        ];
        
        setOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // In a real application, this would be an actual API call
      // For now, we'll simulate the update
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update order in state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'default';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
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
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.username}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'completed' ? 'success' : 'secondary'}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No orders found with the selected status.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
