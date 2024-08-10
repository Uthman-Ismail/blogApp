import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import '../style/fullPost.css';

const FullPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');
  let currentUser;

  
  if (token) {
    const decodedToken = jwtDecode(token);
    currentUser = decodedToken; // Contains user information like id, name, etc.
  }

  
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3000/posts/${id}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`http://localhost:3000/posts/${id}/comments`);
        setComments(commentsResponse.data);

        const likesResponse = await axios.get(`http://localhost:3000/posts/${id}/likes`);
        setLikes(likesResponse.data.count);

      setLoading(false);
      }catch(err){
        setError('Failed to fetch the post');
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const toggleLike = async () => {
    //const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:3000/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(!liked);
      setLikes(prevLikes => liked ? prevLikes - 1 : prevLikes + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    //const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:3000/posts/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    //const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/posts/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the user is authenticated
        },
      });
      // Update the comments list after deletion
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };
  

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="post-container">
      <h1>{post.title}</h1>
      <p style={{fontWeight : 700}}>posted by {post.author.name} @ {post.updatedAt.slice(0, 10)}</p>
      <p>{post.description}</p>
      <p>{post.content}</p>
  
      <div className="like-container">
        <p>{likes} {likes === 1 ? 'Like' : 'Likes'}</p>
        <button onClick={toggleLike}>
          <FontAwesomeIcon icon={liked ? faThumbsDown : faThumbsUp} size="2x" color={liked ? 'red' : 'black'} />
        </button>
      </div>
  
      <h3>Comments</h3>
      
      <ul>
  {comments.map(comment => (
    <li key={comment.id} className="comment-item" >
      <div>
      <strong>{comment.author?.name || 'Unknown Author'}</strong>: {comment.content}
        {comment.author.id === currentUser.userId && ( // Check if the logged-in user is the author
          <button className='del' onClick={() => handleDeleteComment(comment.id)}>Delete</button>
        )}
      </div>
    </li>
  ))}
</ul>

      
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleCommentSubmit}>Submit</button>
      </div>
    </div>
  );
  
};

export default FullPost;
