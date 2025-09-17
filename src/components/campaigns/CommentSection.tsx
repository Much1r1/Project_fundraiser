import React, { useState } from 'react';
import { MessageCircle, Flag, ThumbsUp, Reply, MoreVertical } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
  isOrganizer?: boolean;
}

const CommentSection = () => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const comments: Comment[] = [
    {
      id: '1',
      author: 'Kenya Water Foundation',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'Thank you all for the incredible support! We just completed our first well and the community response has been overwhelming. Updates and photos coming soon!',
      date: '2024-01-20',
      likes: 12,
      isOrganizer: true,
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'This is such an inspiring project! I\'ve been following the progress and it\'s amazing to see the impact you\'re making in these communities.',
      date: '2024-01-19',
      likes: 8,
      replies: [
        {
          id: '2-1',
          author: 'Kenya Water Foundation',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
          content: 'Thank you Sarah! Your support means everything to us and the communities we serve.',
          date: '2024-01-19',
          likes: 3,
          isOrganizer: true,
        },
      ],
    },
    {
      id: '3',
      author: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'Would love to see more detailed updates about the drilling process and community involvement!',
      date: '2024-01-18',
      likes: 5,
    },
  ];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      // Handle reply submission
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
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

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </h3>

        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex space-x-4">
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
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 ml-8">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.author}...`}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim()}
                          className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <img
                          src={reply.avatar}
                          alt={reply.author}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                {reply.author}
                              </h5>
                              {reply.isOrganizer && (
                                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full text-xs font-medium">
                                  Organizer
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(reply.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                              {reply.content}
                            </p>
                            <div className="flex items-center space-x-3 text-xs">
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;