import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

const Profile: React.FC = () => {
    const { updateProfile, changePassword, logout, isPasswordChanging, loggedInUser, user: authUser } = useAuth();

    const [user, setUser] = useState<User>(authUser);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    useEffect(() => {
        // Fetch user if not available
        if (!authUser) {
            const fetchUser = async () => {
                const fetched = await loggedInUser();
                setUser(fetched);
            };
            fetchUser();
        } else {
            setUser(authUser);
        }
    }, [authUser, loggedInUser]);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
            });
        }
    }, [user]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);

        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.current || !password.new || !password.confirm) {

            toast.error('Please fill in all password fields.');
            return;
        }

        if (password.new.length < 6) {
            toast.error('New password must be at least 6 characters.');
            return;
        }

        if (password.new !== password.confirm) {
            toast.error('New password and confirmation do not match.');
            return;
        }

        try {
            await changePassword(password.current, password.new, password.confirm, user._id);
            setPassword({ current: '', new: '', confirm: '' });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Password update error:', error);
        }
    };



    const handleLogout = () => logout();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your account details</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage
                                        src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`}
                                        alt={user?.first_name}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {formData.first_name.charAt(0)}
                                        {formData.last_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="font-medium text-lg">
                                    {formData.first_name} {formData.last_name}
                                </h3>
                                <p className="text-sm text-gray-500">{formData.email}</p>

                                <div className="w-full mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Responder ID</p>
                                    <p className="font-mono font-medium text-gray-900">{user?.responder_id}</p>
                                </div>

                                <div className="w-full mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <div className="flex items-center">
                                        <span
                                            className={`w-2 h-2 rounded-full mr-2 ${user?.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        ></span>
                                        <p
                                            className={`font-medium ${user?.availability_status === 'available' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        >
                                            {user?.availability_status === 'available' ? 'Available' : 'Busy'}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full mt-6">
                                    <Separator className="my-6" />
                                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                                        Log Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            contentEditable="false"
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="phone_number">Phone Number</Label>
                                        <Input
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleFormChange}
                                        />
                                    </div>

                                    <Button className="mt-6" type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            name="current"
                                            type="password"
                                            value={password.current}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                name="new"
                                                type="password"
                                                value={password.new}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirm"
                                                type="password"
                                                value={password.confirm}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                    </div>

                                    <Button className="mt-6" type="submit" disabled={isPasswordChanging}>
                                        {isPasswordChanging ? 'Updating...' : 'Change Password'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
