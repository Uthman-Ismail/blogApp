import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/blogPostForm.css'

const BlogPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
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
          setDescription(response.data.description)
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
      description,
      content
    };
    console.log(postData.description);
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
      alert('Blog posted');
      navigate('/');
    } catch (error) {
      console.error('Error creating/updating post', error);
    }
  };

  return (
    <div className="container">
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
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        
        <button type="submit">{postId ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
};

export default BlogPostForm;
