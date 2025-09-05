import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import React Select

export default function PostForm({ setPosts }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [providerEmail, setProviderEmail] = useState('');
  const [service, setService] = useState(null); // Change to a single service
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setProviderEmail(user.username);
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/services');
        const serviceOptions = response.data.map(service => ({
          value: service.id,  // Use service.id
          label: service.name,
        }));
        setAvailableServices(serviceOptions);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleServiceChange = (selectedOption) => {
    setService(selectedOption); // Set the selected service directly
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('provider_email', providerEmail);

    images.forEach(image => {
      formData.append('images', image);
    });

    if (service) {
      formData.append('services', service.value); // Append the selected service ID
    }

    try {
      await axios.post('http://localhost:8081/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPosts(prev => [{ title, content, provider_email: providerEmail }, ...prev]);
      setTitle('');
      setContent('');
      setImages([]);
      setService(null); // Reset the selected service
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title">Write Your New Post 💬</h2>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post Title"
            className="form-control mb-3"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Post Content"
            className="form-control mb-3"
            rows="4"
          ></textarea>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="form-control mb-3"
          />
          <Select
            options={availableServices}
            onChange={handleServiceChange}
            className="mb-3"
            placeholder="Select a Service..." // Updated placeholder
            styles={{
              control: (base) => ({
                ...base,
                borderColor: 'lightgray',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#007bff',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: '#333',
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999, // Ensure the dropdown appears on top
              }),
            }}
          />
          <button
            onClick={handlePost}
            className="btn btn-primary btn-lg w-100"
          >
            Publish Post 🚀
          </button>
        </div>
      </div>
    </div>
  );
}