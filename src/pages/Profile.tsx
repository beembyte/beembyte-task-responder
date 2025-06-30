import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Globe, Briefcase, Clock, Star, Award, Link as LinkIcon } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

const Profile: React.FC = () => {
    const { updateProfile, changePassword, logout, isPasswordChanging, loggedInUser, user: authUser } = useAuth();

    const [user, setUser] = useState<User>(authUser);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

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
        } catch (error: any) {
            console.error('Password update error:', error);
        }
    };

    const handleLogout = () => logout();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <Avatar className="h-24 w-24 border-4 border-primary/10">
                            <AvatarImage
                                src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`}
                                alt={user?.first_name}
                            />
                            <AvatarFallback className="text-2xl bg-primary/10">
                                {formData.first_name.charAt(0)}
                                {formData.last_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {formData.first_name} {formData.last_name}
                                </h1>
                                {user?.rank_status && (
                                    <Badge 
                                        className="text-white"
                                        style={{ backgroundColor: user.rank_status.rank_color }}
                                    >
                                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                        {user.rank_status.rank_name}
                                    </Badge>
                                )}
                            </div>
                            
                            {user?.job_title && (
                                <p className="text-gray-600 mb-2">{user.job_title}</p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {user?.city && user?.country && (
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.city}, {user.country}</span>
                                    </div>
                                )}
                                {user?.years_of_experience && (
                                    <div className="flex items-center space-x-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{user.years_of_experience}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-3">
                                <span className="text-xs text-gray-500">Responder ID:</span>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{user?.responder_id}</span>
                                <div className="flex items-center space-x-1">
                                    <span className={`w-2 h-2 rounded-full ${user?.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className={`text-sm font-medium ${user?.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                                        {user?.availability_status === 'available' ? 'Available' : 'Busy'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                            {/* Rank Progress Display */}
                            {user?.rank_status && user?.rank_criteria && (
                                <div className="flex flex-col space-y-2">
                                    <div className="w-full">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{user.rank_criteria.tasks_completed} tasks completed</span>
                                            <span>{user.rank_status.criteria.tasks_completed} for next rank</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${Math.min((user.rank_criteria.tasks_completed / user.rank_status.criteria.tasks_completed) * 100, 100)}%`,
                                                    backgroundColor: user.rank_status.rank_color 
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'personal', label: 'Personal Info' },
                                { id: 'professional', label: 'Professional' },
                                { id: 'skills', label: 'Skills & Portfolio' },
                                { id: 'security', label: 'Security' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">Phone Number</Label>
                                            <Input
                                                id="phone_number"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    {(user?.country || user?.state || user?.city) && (
                                        <>
                                            <Separator className="my-6" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {user?.country && (
                                                    <div className="space-y-2">
                                                        <Label>Country</Label>
                                                        <Input value={user.country} disabled />
                                                    </div>
                                                )}
                                                {user?.state && (
                                                    <div className="space-y-2">
                                                        <Label>State</Label>
                                                        <Input value={user.state} disabled />
                                                    </div>
                                                )}
                                                {user?.city && (
                                                    <div className="space-y-2">
                                                        <Label>City</Label>
                                                        <Input value={user.city} disabled />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <Button className="mt-6" type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user?.job_title && (
                                        <div className="space-y-2">
                                            <Label>Job Title</Label>
                                            <Input value={user.job_title} disabled />
                                        </div>
                                    )}
                                    {user?.years_of_experience && (
                                        <div className="space-y-2">
                                            <Label>Years of Experience</Label>
                                            <Input value={user.years_of_experience} disabled />
                                        </div>
                                    )}
                                </div>

                                {user?.preferred_categories && user.preferred_categories.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Preferred Categories</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {user.preferred_categories.map((category, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3" />
                                                    <span>{category}</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {user?.tools_technologies && (
                                    <div className="space-y-2">
                                        <Label>Tools & Technologies</Label>
                                        <Textarea value={user.tools_technologies} disabled rows={4} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="space-y-6">
                                {user?.portfolio_link && (
                                    <div className="space-y-2">
                                        <Label>Portfolio Link</Label>
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <LinkIcon className="w-4 h-4 text-gray-400" />
                                            <a href={user.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-1">
                                                {user.portfolio_link}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {user?.resume && (
                                    <div className="space-y-2">
                                        <Label>Resume</Label>
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <LinkIcon className="w-4 h-4 text-gray-400" />
                                            <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-1">
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {user?.rank_status && (
                                    <div className="space-y-4">
                                        <Label>Current Rank Progress</Label>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge 
                                                    className="text-white"
                                                    style={{ backgroundColor: user.rank_status.rank_color }}
                                                >
                                                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                                    {user.rank_status.rank_name}
                                                </Badge>
                                                <span className="text-sm text-gray-600">
                                                    {user.rank_criteria?.tasks_completed || 0} / {user.rank_status.criteria.tasks_completed} tasks
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="h-3 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        width: `${Math.min(((user.rank_criteria?.tasks_completed || 0) / user.rank_status.criteria.tasks_completed) * 100, 100)}%`,
                                                        backgroundColor: user.rank_status.rank_color 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="flex justify-between items-center pt-6 border-t">
                                    <Button type="submit" disabled={isPasswordChanging}>
                                        {isPasswordChanging ? 'Updating...' : 'Change Password'}
                                    </Button>
                                    <Button variant="outline" onClick={handleLogout}>
                                        Log Out
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
