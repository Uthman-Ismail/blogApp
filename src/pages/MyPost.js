// src/pages/MyPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../style/post.css'

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage

    try {
      await axios.delete(`http://localhost:3000/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Post deleted successfully');
      fetchMyPosts(); 
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

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
    }
};  

  useEffect(() => {   
    fetchMyPosts();
  }, [navigate]);

  return (
    <div className="container">
      <h1>My Posts</h1>
      <Link to="/create">
        <button>Create New Post</button>
      </Link>
      <div className="posts-list">
        {posts.map(post => (
          <div className="post-card" key={post.id}>
            <Link to={`/post/${post.id}`} className="post-link">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
            <Link to={`/update/${post.id}`}>
              <button>Edit</button>
            </Link>
            <button onClick={() => handleDelete(post.id)}>delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPost;
