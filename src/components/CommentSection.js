import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

export default function CommentSection({ postId }) {
  const [comments, setCommentsState] = useState([]);
  const [showNestedComments, setShowNestedComments] = useState({});
  const [providerEmails, setProviderEmails] = useState([]);

  // Get logged-in user
  const user = JSON.parse(sessionStorage.getItem('user'));
  const email = user ? user.username : null;

  // Fetch comments and provider emails
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/comments?postId=${postId}`)
      .then((res) => {
        console.log('Comments data:', res.data);
        setCommentsState(res.data);
      })
      .catch((error) => console.error('Error fetching comments:', error));

    axios
      .get(`http://localhost:8081/api/posts/providerEmails`)
      .then((res) => {
        setProviderEmails(res.data);
      })
      .catch((error) => console.error('Error fetching providerEmails:', error));
  }, [postId]);

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error('Comment ID is null or undefined');
      return;
    }
    try {
      await axios.get(`http://localhost:8081/api/comments/delete/${commentId}`);
      setCommentsState((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Recursive rendering of comments and replies
  const renderComments = (parentId = null) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => {
        const hasReplies = comments.some((nested) => nested.parentId === c.id);
        const isCommentFromCurrentUser = c.email === email;
        const isProvider = providerEmails.includes(c.email);

        return (
          <div key={c.id} className={`ml-${parentId ? '8' : '0'} mt-4`}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start space-x-3">
                {/* User image or fallback icon */}
                {c.image ? (
                  <img
                    src={`http://localhost:8081${c.image}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 text-xl">
                    👤
                  </div>
                )}

                {/* Comment text and controls */}
                <div>
                  <div className="text-gray-800">
                    <span className="font-semibold">{c.name}</span>: {c.content}
                    {isProvider && <span className="ml-1">⭐</span>}
                  </div>

                  {/* Delete button (if owner) */}
                  {isCommentFromCurrentUser && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 hover:underline mt-1 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply form */}
            <CommentForm postId={postId} parentId={c.id} setComments={setCommentsState} />

            {/* Show/hide replies */}
            {hasReplies && !showNestedComments[c.id] && (
              <button
                onClick={() => setShowNestedComments((prev) => ({ ...prev, [c.id]: true }))}
                className="text-blue-500 hover:underline mt-2 ml-12"
              >
                Show Replies
              </button>
            )}

            {showNestedComments[c.id] && (
              <>
                {renderComments(c.id)}
                <button
                  onClick={() => setShowNestedComments((prev) => ({ ...prev, [c.id]: false }))}
                  className="text-blue-500 hover:underline mt-2 ml-12"
                >
                  Hide Replies
                </button>
              </>
            )}
          </div>
        );
      });

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <CommentForm postId={postId} setComments={setCommentsState} />
      {renderComments()}
    </div>
  );
}
