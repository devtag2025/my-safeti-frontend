import React, { useState, useEffect } from "react";
import { User, Mail, Shield, CalendarCheck, Edit2, Key, Loader2, Save, X } from "lucide-react";
import { getCurrentUser, updateUser } from "../api/userService";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setFormData({ 
                    fullName: userData.fullName, 
                    email: userData.email, 
                    oldPassword: "", 
                    newPassword: "" 
                });
            } catch (err) {
                setError(err.message || "Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        if (formData.newPassword && formData.newPassword === formData.oldPassword) {
            setError("New password must be different from the old password.");
            setUpdating(false);
            return;
        }

        try {
            const updatedUser = await updateUser({
                fullName: formData.fullName,
                email: formData.email,
                ...(formData.newPassword && { 
                    oldPassword: formData.oldPassword, 
                    password: formData.newPassword 
                }),
            });

            setUser(updatedUser);
            setEditMode(false);
            setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "" }));
            toast.success("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Error updating profile.");
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setError(null);
        setFormData({ 
            fullName: user.fullName, 
            email: user.email, 
            oldPassword: "", 
            newPassword: "" 
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="text-gray-600">Loading user details...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">User Profile</h2>
                <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>

            {error && (
                <Alert className="mb-6" variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{user?.fullName}</CardTitle>
                                <p className="text-gray-600">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {!editMode && (
                            <Button onClick={() => setEditMode(true)} variant="outline">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {!editMode ? (
                        <>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Email Address</Label>
                                        <p className="text-base font-medium">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Role</Label>
                                        <p className="text-base font-medium capitalize">{user?.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarCheck className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Account Status</Label>
                                        <div className="mt-1">
                                            <Badge className={getStatusColor(user?.approvalStatus)}>
                                                {user?.approvalStatus?.charAt(0).toUpperCase() + user?.approvalStatus?.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <Separator className="my-4" />
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Key className="w-4 h-4 text-gray-500" />
                                        <Label className="text-sm font-medium">Change Password</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="oldPassword">Current Password</Label>
                                        <Input
                                            id="oldPassword"
                                            name="oldPassword"
                                            type="password"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="Enter your current password"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter a new password (optional)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={updating}
                                    className="flex-1"
                                >
                                    {updating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    className="flex-1"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;