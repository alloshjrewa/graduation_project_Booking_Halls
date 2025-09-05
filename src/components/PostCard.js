import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import axios from 'axios';

export default function PostCard({ post, currentUserId }) {
    const [showComments, setShowComments] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [liked, setLiked] = useState(post.likedByCurrentUser || false);
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        setLiked(post.likedByCurrentUser);
        setLikes(post.likes || 0);
    }, [post]);

    const handleLike = async () => {
        try {
            const newLiked = !liked;
            // Optimistically update the UI
            setLiked(newLiked);
            setLikes(newLiked ? likes + 1 : likes - 1);

            await axios.post(`http://localhost:8081/api/posts/${post.postId}/like`, {
                liked: newLiked,
                userEmail: currentUserId
            });
        } catch (error) {
            console.error('Error updating like status:', error);
            // Revert the UI on error
            setLiked(liked);
            setLikes(likes);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg text-black w-full my-6">
            <h3 className="text-3xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.content}</p>

            {post.images && post.images.length > 0 && (
                <div className="flex flex-col items-center w-full mb-4">
                    {post.images.slice(0, showAllImages ? post.images.length : 1).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post Image ${index + 1}`}
                            className="w-full h-80 object-cover rounded-lg mb-2"
                        />
                    ))}
                    {post.images.length > 1 && !showAllImages && (
                        <button
                            onClick={() => setShowAllImages(true)}
                            className="text-blue-500 hover:underline"
                        >
                            Show more ({post.images.length - 1})
                        </button>
                    )}
                    {showAllImages && (
                        <button
                            onClick={() => setShowAllImages(false)}
                            className="text-blue-500 hover:underline"
                        >
                            Hide images
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center text-xl ${liked ? 'text-pink-500' : 'text-gray-500'} hover:text-pink-500 transition`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={liked ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" : "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"} />
                    </svg>
                    {likes}
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-sm text-pink-500 hover:underline"
                >
                    {showComments ? 'Hide comments' : 'Show comments 💬'}
                </button>
            </div>

            {showComments && <CommentSection postId={post.postId} />}
        </div>
    );
}