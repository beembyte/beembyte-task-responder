
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Briefcase, Clock, Star, Award, Link as LinkIcon, Calendar, Phone, Video } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

const Profile: React.FC = () => {
    const { logout, loggedInUser, user: authUser } = useAuth();

    const [user, setUser] = useState<User>(authUser);
    const [activeTab, setActiveTab] = useState('personal');

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

    const handleLogout = () => logout();

    // Helper function to get rank tasks completed requirement
    const getRankTasksRequired = (rankStatus: any) => {
        return rankStatus?.min_tasks_completed || rankStatus?.criteria?.tasks_completed || 0;
    };

    // Helper function to get responder data
    const getResponderData = () => {
        if (typeof user?.responder_id === 'object' && user.responder_id) {
            return user.responder_id;
        }
        return null;
    };

    const responderData = getResponderData();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                            <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-4 border-primary/10">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.first_name}`}
                                    alt={user?.first_name}
                                />
                                <AvatarFallback className="text-lg sm:text-2xl bg-primary/10">
                                    {user?.first_name?.charAt(0) || 'U'}
                                    {user?.last_name?.charAt(0) || ''}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {user?.first_name} {user?.last_name}
                                    </h1>
                                    {responderData?.rank_status && (
                                        <Badge
                                            className="text-white text-xs"
                                            style={{ backgroundColor: responderData.rank_status.rank_color }}
                                        >
                                            <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                            {responderData.rank_status.rank_name}
                                        </Badge>
                                    )}
                                </div>

                                {responderData?.job_title && (
                                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{responderData.job_title}</p>
                                )}

                                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                                    {responderData?.city && responderData?.country && (
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{responderData.city}, {responderData.country}</span>
                                        </div>
                                    )}
                                    {responderData?.years_of_experience && (
                                        <div className="flex items-center space-x-1">
                                            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{responderData.years_of_experience} years experience</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">ID:</span>
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {responderData?.responder_id || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className={`w-2 h-2 rounded-full ${responderData?.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className={`text-xs font-medium ${responderData?.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                                            {responderData?.availability_status === 'available' ? 'Available' : 'Busy'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rank Progress Display - Mobile optimized */}
                        {responderData?.rank_status && responderData?.rank_criteria && (
                            <div className="mt-4">
                                <div className="w-full">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{responderData.rank_criteria.tasks_completed || 0} completed</span>
                                        <span>{getRankTasksRequired(responderData.rank_status)} for next rank</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min(((responderData.rank_criteria.tasks_completed || 0) / (getRankTasksRequired(responderData.rank_status) || 1)) * 100, 100)}%`,
                                                backgroundColor: responderData.rank_status.rank_color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Navigation - Mobile optimized */}
                <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <nav className="flex space-x-2 sm:space-x-8 px-3 sm:px-6 min-w-max">
                            {[
                                { id: 'personal', label: 'Personal' },
                                { id: 'professional', label: 'Professional' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-3 sm:p-6">
                        {activeTab === 'personal' && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm">First Name</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {user?.first_name || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Last Name</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {user?.last_name || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-sm">Email</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {user?.email || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-sm">Phone Number</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {user?.phone_number || 'Not specified'}
                                        </div>
                                    </div>
                                </div>

                                {(responderData?.country || responderData?.state || responderData?.city) && (
                                    <>
                                        <Separator className="my-4 sm:my-6" />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            {responderData?.country && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm">Country</Label>
                                                    <div className="p-2 bg-gray-50 rounded border text-sm">
                                                        {responderData.country}
                                                    </div>
                                                </div>
                                            )}
                                            {responderData?.state && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm">State</Label>
                                                    <div className="p-2 bg-gray-50 rounded border text-sm">
                                                        {responderData.state}
                                                    </div>
                                                </div>
                                            )}
                                            {responderData?.city && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm">City</Label>
                                                    <div className="p-2 bg-gray-50 rounded border text-sm">
                                                        {responderData.city}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Job Title</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {responderData?.job_title || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Years of Experience</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm">
                                            {responderData?.years_of_experience ? `${responderData.years_of_experience} years` : 'Not specified'}
                                        </div>
                                    </div>
                                </div>

                                {responderData?.bio && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Bio</Label>
                                        <div className="p-2 bg-gray-50 rounded border text-sm min-h-[100px]">
                                            {responderData.bio}
                                        </div>
                                    </div>
                                )}

                                {responderData?.skills && responderData.skills.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Skills</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {responderData.skills.map((skill, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {responderData?.tools_technologies && responderData.tools_technologies.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Tools & Technologies</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {responderData.tools_technologies.map((tool, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {typeof tool === 'string' ? tool : tool?.name || 'Unknown'}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {responderData?.preferred_categories && responderData.preferred_categories.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Preferred Categories</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {responderData.preferred_categories.map((category, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center space-x-1 text-xs">
                                                    <Star className="w-3 h-3" />
                                                    <span>{typeof category === 'string' ? category : category?.name || 'Unknown'}</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(responderData?.portfolio_link || responderData?.resume) && (
                                    <>
                                        <Separator className="my-4 sm:my-6" />
                                        <div className="space-y-4">
                                            {responderData?.portfolio_link && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm">Portfolio Link</Label>
                                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                        <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <a href={responderData.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-1 text-sm break-all">
                                                            {responderData.portfolio_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {responderData?.resume && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm">Resume</Label>
                                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                        <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <a href={responderData.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-1 text-sm">
                                                            View Resume
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {(responderData?.preferred_callDate || responderData?.preferred_callTime || responderData?.call_platform) && (
                                    <>
                                        <Separator className="my-4 sm:my-6" />
                                        <div className="space-y-4">
                                            <Label className="text-sm">Call Preferences</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {responderData?.preferred_callDate && (
                                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Preferred Date</p>
                                                            <p className="text-sm">{new Date(responderData.preferred_callDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {responderData?.preferred_callTime && (
                                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Preferred Time</p>
                                                            <p className="text-sm">{responderData.preferred_callTime}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {responderData?.call_platform && (
                                                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                        <Video className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Platform</p>
                                                            <p className="text-sm">{responderData.call_platform}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {responderData?.rank_status && (
                                    <>
                                        <Separator className="my-4 sm:my-6" />
                                        <div className="space-y-4">
                                            <Label className="text-sm">Current Rank Progress</Label>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge
                                                        className="text-white text-xs"
                                                        style={{ backgroundColor: responderData.rank_status.rank_color }}
                                                    >
                                                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                                        {responderData.rank_status.rank_name}
                                                    </Badge>
                                                    <span className="text-xs text-gray-600">
                                                        {responderData.rank_criteria?.tasks_completed || 0} / {getRankTasksRequired(responderData.rank_status)} tasks
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="h-3 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${Math.min(((responderData.rank_criteria?.tasks_completed || 0) / (getRankTasksRequired(responderData.rank_status) || 1)) * 100, 100)}%`,
                                                            backgroundColor: responderData.rank_status.rank_color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Show message if no professional data */}
                                {!responderData && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-sm">No professional information available</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
