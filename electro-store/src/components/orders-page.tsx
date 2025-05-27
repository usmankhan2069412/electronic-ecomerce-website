import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/toast-context";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  payment_status: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be an actual API call
        // For now, we'll simulate the data fetch with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch orders from API
        const response = await axios.get("/api/orders");
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showOrderDetails && selectedOrder) {
    return (
      <div className="container py-10">
        <Button 
          variant="outline" 
          onClick={() => setShowOrderDetails(false)}
          className="mb-6"
        >
          Back to Orders
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order #{selectedOrder.id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(selectedOrder.status)}`}>
            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment:</span>
                  <span>{selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold">${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{selectedOrder.shipping_address}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img 
                    src={item.product_image} 
                    alt={item.product_name} 
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-muted-foreground">Total Items: </span>
              <span className="font-medium">{selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount: </span>
              <span className="font-bold">${selectedOrder.total_amount.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate("/products")}>Start Shopping</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Order #{order.id}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <CardDescription>{formatDate(order.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p className="font-medium">Total: ${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button onClick={() => handleViewOrderDetails(order)}>View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
