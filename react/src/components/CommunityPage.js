import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import PostForm from './PostForm';
import axios from 'axios';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [isProvider, setIsProvider] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    
    useEffect(() => {
        let userData = JSON.parse(sessionStorage.getItem('user'));
        
        if (userData && userData.authorities?.some(auth => auth.authority === 'ROLE_PROVIDER')) {
            setIsProvider(true);
            console.log(true);
        }
        userData = userData.username;
        axios.get(`http://localhost:8081/api/posts/${userData}`)
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, []);

    // Get the current user ID from the session storage
    const currentUserId = JSON.parse(sessionStorage.getItem('user'))?.username;
    console.log(currentUserId);

    return (
        <div className="min-h-screen p-8 bg-gradient-to-r from-[#66cef6] to-[#f666b1] text-white relative">
            <a
                href="/"
                className="absolute top-6 left-6 bg-gradient-to-r from-[#66cef6] to-[#f666b1] text-white font-bold text-xl py-3 px-6 rounded-full shadow-2xl hover:opacity-90 transition duration-300 z-10 no-underline"
            >
                ← Back to Home
            </a>

            <div className="max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-bold mb-8 text-center animate-pulse">
                    🎉 JoyNest Community
                </h1>
                {isProvider && (
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-gradient-to-r from-[#66cef6] to-[#f666b1] text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition duration-300"
                        >
                            {showForm ? 'Close Post Form' : 'Create Post'}
                        </button>
                    </div>
                )}
                {showForm && <PostForm setPosts={setPosts} />}

                <div className="grid md:grid-cols-1 gap-6 mt-10">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                    ))}
                </div>
            </div>
        </div>
    );
}