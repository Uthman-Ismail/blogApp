// src/pages/UpdatePost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogPostForm from '../component/BlogPostForm';

const UpdatePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post', error);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div>
      <h1>Update Post</h1>
      {post ? <BlogPostForm postId={id} existingPost={post} /> : <p>Loading...</p>}
    </div>
  );
};

export default UpdatePost;
