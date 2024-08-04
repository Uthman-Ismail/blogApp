// src/pages/CreatePost.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTitle(response.data.title);
          setContent(response.data.content);
          setTags(response.data.tags.join(', '));
        } catch (error) {
          console.error('Error fetching post data', error);
        }
      };
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
    };
    const token = localStorage.getItem('token');

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (postId) {
        await axios.put(`http://localhost:3000/posts/${postId}`, postData, { headers });
      } else {
        await axios.post('http://localhost:3000/posts', postData, { headers });
      }

      navigate('/');
    } catch (error) {
      console.error('Error creating/updating post', error);
    }
  };

  return (
    <div className="container">
      <h1>{postId ? 'Update Post' : 'Create Post'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit">{postId ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
};

export default CreatePost;
