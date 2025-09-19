import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, DollarSign, Calendar, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  category: yup.string().required('Category is required'),
  goal: yup.number().required('Goal amount is required').min(100, 'Goal must be at least $100'),
  description: yup.string().required('Description is required').min(50, 'Description must be at least 50 characters'),
  story: yup.string().required('Full story is required').min(200, 'Story must be at least 200 characters'),
  location: yup.string().required('Location is required'),
  duration: yup.number().required('Campaign duration is required').min(7, 'Minimum 7 days').max(365, 'Maximum 365 days'),
});

interface CampaignForm {
  title: string;
  category: string;
  goal: number;
  description: string;
  story: string;
  location: string;
  duration: number;
}

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CampaignForm>({
    resolver: yupResolver(schema),
  });

  const categories = [
    'Medical', 'Education', 'Community', 'Emergency', 'Environment', 
    'Animals', 'Sports', 'Technology', 'Arts', 'Religious'
  ];

  const watchedGoal = watch('goal');
  const watchedTitle = watch('title');

  const onSubmit = async (data: CampaignForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Campaign created successfully!');
      navigate('/campaigns/1'); // Navigate to the created campaign
    } catch (error) {
      toast.error('Failed to create campaign. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your Campaign
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tell your story and raise funds for what matters most to you.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter a compelling title for your campaign"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="City, State/Province, Country"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.location.message}
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
                  {...register('goal')}
                  type="number"
                  min="10000"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 500000"
                />
                {errors.goal && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.goal.message}
                  </p>
                )}
                {watchedGoal && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Platform fee (5%): KES {Math.round(watchedGoal * 0.05).toLocaleString()} | 
                    You'll receive: KES {Math.round(watchedGoal * 0.95).toLocaleString()}
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
                  {...register('duration')}
                  type="number"
                  min="7"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="30"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Write a brief description that will appear on your campaign card"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
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
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                {...register('story')}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Tell your full story here. Explain why this campaign is important, what you plan to do with the funds, and how people can help. Be detailed and authentic."
              />
              {errors.story && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.story.message}
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
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
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
                  Ready to launch?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your campaign will be reviewed before going live. This usually takes 1-2 business days.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Save as Draft
                </button>
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
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;