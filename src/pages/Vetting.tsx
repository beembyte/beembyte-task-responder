
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useVetting } from '@/hooks/useVetting';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useCountryState } from '@/hooks/useCountryState';
import { ChevronLeft, ChevronRight, Upload, CalendarIcon, Clock, Video } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EXPERTISE_AREAS = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'Copywriting', 'Digital Marketing', 'SEO/SEM',
  'Data Analysis', 'Project Management', 'Virtual Assistant', 'Translation',
  'Video Editing', 'Photography', 'Social Media Management', 'Customer Support',
  'Assignment and Projects Handling'
];

const CALL_PLATFORMS = [
  { name: 'Zoom', icon: 'zoom' },
  { name: 'Google Meet', icon: 'google-meet' }
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const Vetting: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitVetting, isSubmitting } = useVetting();
  const { uploadSingleFile, isUploading } = useFileUpload();
  const { countries, states, isLoadingCountries, isLoadingStates, fetchStates } = useCountryState();
  const [currentStep, setCurrentStep] = useState(1);
  const [callDate, setCallDate] = useState<Date>();
  const [callTime, setCallTime] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    job_title: '',
    years_of_experience: '',
    portfolio_link: '',
    tools_technologies: '',
    preferred_categories: [] as string[],
    preferred_callDate: null as Date | null,
    preferred_callTime: '',
    call_platform: '',
    resume: '',
    country: '',
    state: '',
    city: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.country && formData.state && formData.city);
      case 2:
        return !!(formData.job_title && formData.years_of_experience && formData.tools_technologies && formData.preferred_categories.length > 0);
      case 3:
        return true; // Resume is now optional, so this step is always valid
      case 4:
        return !!(callDate && callTime && formData.call_platform);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding to the next step.",
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(country => country.name.common === countryName);
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, country: countryName, state: '', city: '' }));
      setSelectedCountryCode(selectedCountry.cca2);
      fetchStates(selectedCountry.cca2);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferred_categories: checked 
        ? [...prev.preferred_categories, category]
        : prev.preferred_categories.filter(item => item !== category)
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill in all required fields before submitting.",
      });
      return;
    }

    let resumeUrl = '';
    
    // Don't leave vetting page if file upload fails or vetting fails
    try {
      // Upload resume file if provided
      if (resumeFile) {
        const uploadResult = await uploadSingleFile(resumeFile);
        if (uploadResult.success && uploadResult.url) {
          resumeUrl = uploadResult.url;
        } else {
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Failed to upload resume. Please try again.",
          });
          return; // Stay on vetting page
        }
      }

      const submissionData = {
        ...formData,
        preferred_callDate: callDate,
        preferred_callTime: callTime,
        call_platform: formData.call_platform,
        ...(resumeUrl && { resume: resumeUrl }) // Only include resume if uploaded
      };
      
      const result = await submitVetting(submissionData);
      
      if (result.success) {
        // Only navigate to dashboard on successful vetting submission
        navigate('/dashboard');
      } else {
        // Stay on vetting page and show error
        toast({
          variant: "destructive",
          title: "Vetting Submission Failed",
          description: "Please check your information and try again.",
        });
      }
    } catch (error) {
      console.error('Vetting submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An error occurred. Please try again.",
      });
      // Stay on vetting page
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setCallDate(date);
    setIsDatePickerOpen(false); // Auto-close the popover
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={handleCountryChange}
                  disabled={isLoadingCountries}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select your country"} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.cca2} value={country.name.common}>
                        {country.name.common}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State/Region *</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                  disabled={!selectedCountryCode || isLoadingStates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingStates ? "Loading states..." : 
                      !selectedCountryCode ? "Select country first" : 
                      "Select your state/region"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.state_code} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Professional Information</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="jobTitle">Current Job Title/Role *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.job_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select value={formData.years_of_experience} onValueChange={(value) => setFormData(prev => ({ ...prev, years_of_experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-5">4-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="tools">Tools/Technologies Known *</Label>
                <Textarea
                  id="tools"
                  value={formData.tools_technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, tools_technologies: e.target.value }))}
                  placeholder="e.g., React (Expert), Node.js (Intermediate), Figma (Advanced)"
                />
              </div>
              
              <div>
                <Label>Preferred Categories *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                  {EXPERTISE_AREAS.map(category => (
                    <div key={category} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={formData.preferred_categories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="portfolio">Portfolio Link</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_link: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Resume Upload</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="resume">Upload Resume (Optional)</Label>
                <div className="mt-2">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('resume')?.click()}
                    className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50"
                  >
                    <Upload size={24} />
                    <span className="text-sm">
                      {resumeFile ? resumeFile.name : "Click to upload your resume (optional)"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX files
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">📞 Vetting Call Schedule</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Preferred Date for Vetting Call *</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !callDate && "text-muted-foreground"
                        )}
                        onClick={() => setIsDatePickerOpen(true)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {callDate ? format(callDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={callDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Preferred Time *</Label>
                  <Select value={callTime} onValueChange={setCallTime}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{time}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Preferred Call Platform *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {CALL_PLATFORMS.map(platform => (
                    <div
                      key={platform.name}
                      className={cn(
                        "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50",
                        formData.call_platform === platform.name && "border-primary bg-primary/5"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, call_platform: platform.name }))}
                    >
                      {platform.icon === 'zoom' ? (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#2D8CFF"/>
                          <path d="M7 8h6v8l-6-4V8z" fill="white"/>
                          <path d="M17 8h-4v8h4v-8z" fill="white"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#34A853"/>
                          <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      <span className="font-medium">{platform.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 text-center mb-6">
            Help us understand your skills and experience better
          </p>
          <div className="w-full">
            <Progress value={progress} className="w-full h-3" />
            <p className="text-sm text-gray-500 mt-2 text-center">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-8 mb-8">
          {renderStep()}
        </div>

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="flex items-center space-x-2"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </Button>
          )}

          {currentStep === 1 && <div></div>}

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="flex items-center space-x-2">
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isUploading}
              className="flex items-center space-x-2"
            >
              <span>{isSubmitting || isUploading ? 'Submitting...' : 'Submit Application'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vetting;
