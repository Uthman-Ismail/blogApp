import React, {useState, useEffect} from "react";
import { useNavigate, Link } from 'react-router-dom';
import About from "./About";
import '../style/post.css';
import '../style/home.css';
import api from "../server/api";

const Home = () => {

    const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePostClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/create');
    } else {
      navigate('/login');
    }
    };
    return (
        <div>
            <h1>All Posts</h1>
            <button onClick={handleCreatePostClick}>Create New Post</button>
            <div className="posts-list">
        {posts.map(post => (
          <div className="post-card" key={post.id}>
            <Link to={`/post/${post.id}`} className="post-link">
              <h2>{post.title}</h2>
              <p style={{fontWeight : 700}}>posted by {post.author.name} @ {post.updatedAt.slice(0,10)}</p>
              <p>{post.description}</p>
            </Link>
          </div>
        ))}
      </div>
            <About />
        </div>
    )
}

export default Home;