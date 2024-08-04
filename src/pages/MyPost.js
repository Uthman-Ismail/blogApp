// src/pages/MyPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/posts/mine', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching my posts', error);
        if (error.response.status === 401) {
          navigate('/login');  // Redirect to login if not authenticated
        }
      }
    };
    fetchMyPosts();
  }, [navigate]);

  return (
    <div className="container">
      <h1>My Posts</h1>
      <Link to="/create">
        <button>Create New Post</button>
      </Link>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <Link to={`/update/${post.id}`}>
              <button>Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPost;
