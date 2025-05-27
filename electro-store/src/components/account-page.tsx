import * as React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "./ui/toast-context";

export function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    password: "",
    confirmPassword: ""
  });
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return "U";
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate password match if changing password
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      // Prepare update data
      const updateData: any = {};
      if (formData.first_name !== user?.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name !== user?.last_name) updateData.last_name = formData.last_name;
      if (formData.email !== user?.email) updateData.email = formData.email;
      if (formData.avatar !== user?.avatar) updateData.avatar = formData.avatar;
      if (formData.password) updateData.password = formData.password;
      
      await updateProfile(updateData);
      
      toast({
        title: "Success",
        description: "Your profile has been updated"
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar} alt={user?.username} />
                      <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="w-full">
                        <label className="text-sm font-medium mb-1 block">Avatar URL</label>
                        <Input
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleChange}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Username</label>
                        <Input value={user?.username} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        {isEditing ? (
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                          />
                        ) : (
                          <Input value={user?.email} disabled />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">First Name</label>
                        {isEditing ? (
                          <Input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                          />
                        ) : (
                          <Input value={user?.first_name || "Not set"} disabled />
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Last Name</label>
                        {isEditing ? (
                          <Input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                          />
                        ) : (
                          <Input value={user?.last_name || "Not set"} disabled />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 gap-2">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">New Password</label>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="destructive" onClick={handleLogout}>
                    Log Out
                  </Button>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
