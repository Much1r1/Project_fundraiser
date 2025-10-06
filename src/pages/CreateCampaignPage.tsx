import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, DollarSign, Calendar, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CampaignForm {
  title: string;
  category: string;
  goal: number;
  description: string;
  story: string;
  location: string;
  duration: number;
}

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Login Required
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          To save and publish your campaign, you need to create an account or log in.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onLogin}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={onRegister}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Register
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CampaignForm>({
    title: '',
    category: '',
    goal: 0,
    description: '',
    story: '',
    location: '',
    duration: 30,
  });
  const [errors, setErrors] = useState<Partial<CampaignForm>>({});
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Medical', 'Education', 'Community', 'Emergency', 'Environment', 
    'Animals', 'Sports', 'Technology', 'Arts', 'Religious'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CampaignForm> = {};

    if (!formData.title || formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.goal || formData.goal < 10000) {
      newErrors.goal = 'Goal must be at least KES 10,000';
    }
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    if (!formData.story || formData.story.length < 200) {
      newErrors.story = 'Story must be at least 200 characters';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (!formData.duration || formData.duration < 7 || formData.duration > 365) {
      newErrors.duration = 'Duration must be between 7 and 365 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CampaignForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + formData.duration);
      
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          story: formData.story,
          goal_amount: formData.goal,
          current_amount: 0,
          category: formData.category,
          location: formData.location,
          image_url: images[0] || null,
          campaign_status: 'draft',
          verification_status: 'pending',
          end_date: endDate.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Campaign created successfully!');
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast.error('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your Campaign
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">
              Tell your story and raise funds for what matters most to you.
            </p>
            {!user && (
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Guest Mode:</strong> Fill out your campaign details now, login required only when ready to publish!
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter a compelling title for your campaign"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="City, State/Province, Country"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Fundraising Goal (KES) *
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.goal || ''}
                  onChange={(e) => handleInputChange('goal', Number(e.target.value))}
                  min="10000"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 500000"
                />
                {errors.goal && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.goal}
                  </p>
                )}
                {formData.goal > 0 && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Platform fee (5%): KES {Math.round(formData.goal * 0.05).toLocaleString()} | 
                    You'll receive: KES {Math.round(formData.goal * 0.95).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Campaign Duration (days) *
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                  min="7"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="30"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.duration}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Write a brief description that will appear on your campaign card"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Images */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Campaign Images
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Upload Image
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload up to 5 high-quality images that tell your story. The first image will be your main campaign photo.
              </p>
            </div>
          </div>

          {/* Campaign Story */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Tell Your Story
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Campaign Story *
              </label>
              <textarea
                rows={10}
                value={formData.story}
                onChange={(e) => handleInputChange('story', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Tell your full story here. Explain why this campaign is important, what you plan to do with the funds, and how people can help. Be detailed and authentic."
              />
              {errors.story && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.story}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                A compelling story increases your chances of success. Include specific details about your cause, goals, and impact.
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Tags
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Add tags to help people find your campaign"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim() || tags.length >= 10}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add relevant tags to help people discover your campaign. Maximum 10 tags.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {user ? 'Ready to launch?' : 'Ready to save and publish?'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {user 
                    ? 'Your campaign will be reviewed before going live. This usually takes 1-2 business days.'
                    : 'You\'ll need to log in to save your campaign for admin review.'
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {user && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5 mr-2" />
                      {user ? 'Create Campaign' : 'Login & Create Campaign'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginRedirect}
        onRegister={handleRegisterRedirect}
      />
    </div>
  );
};

export default CreateCampaignPage;