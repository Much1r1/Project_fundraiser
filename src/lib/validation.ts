import * as yup from 'yup';

export const campaignSchema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  category: yup.string().required('Category is required'),
  goal: yup.number().required('Goal amount is required').min(10000, 'Goal must be at least KES 10,000'),
  description: yup.string().required('Description is required').min(50, 'Description must be at least 50 characters'),
  story: yup.string().required('Full story is required').min(200, 'Story must be at least 200 characters'),
  location: yup.string().required('Location is required'),
  duration: yup.number().required('Campaign duration is required').min(7, 'Minimum 7 days').max(365, 'Maximum 365 days'),
});