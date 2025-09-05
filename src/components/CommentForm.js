import React, { useState } from 'react';
import axios from 'axios';

export default function CommentForm({ postId, parentId, setComments }) {
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false);
    let user = JSON.parse(sessionStorage.getItem('user'));
    let email = null
    if(user){
        email = user.username
    }
    let name = null
    if(user){
        name = user.firstName
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentData = {
            content,
            email: email,
            parentId,
            name: name
        };

        try {
            const response = await axios.post(`http://localhost:8081/api/comments/${postId}`, commentData);
            setComments(prevComments => [...prevComments, response.data]);
            setContent('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            {parentId ? (
                showForm ? (
                    <form onSubmit={handleSubmit} className="mt-2 bg-white shadow-md rounded p-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Write a reply..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="mt-2 btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                            Comment
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="mt-2 text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button onClick={() => setShowForm(true)} className="text-blue-500 hover:underline">
                        Reply
                    </button>
                )
            ) : (
                <form onSubmit={handleSubmit} className="mt-2 bg-white shadow-md rounded p-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Write a comment..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="mt-2 btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Comment
                    </button>
                </form>
            )}
        </div>
    );
}