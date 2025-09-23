import React, { useState } from 'react';
import { MessageCircle, Flag, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CommentSectionProps {
  campaignId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ campaignId }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  // Mock comments for now - in real app, fetch from database
  const comments = [
    {
      id: '1',
      author: 'Campaign Organizer',
      avatar: 'https://ui-avatars.com/api/?name=Campaign+Organizer&background=10b981&color=fff',
      content: 'Thank you all for the incredible support! We are making great progress towards our goal.',
      date: '2024-01-20',
      likes: 12,
      isOrganizer: true,
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
      content: 'This is such an inspiring project! Keep up the great work.',
      date: '2024-01-19',
      likes: 8,
    },
  ];

  const handleSubmitComment = () => {
    if (newComment.trim() && user) {
      // Handle comment submission to database
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave a Comment
          </h3>
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask questions about this campaign..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Be respectful and constructive in your comments.
              </p>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please log in to leave a comment.
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Log In
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.author}
                      </h4>
                      {comment.isOrganizer && (
                        <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                          Organizer
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;