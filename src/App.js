import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './component/Header';
import About from './pages/About';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import FullPost from './pages/FullPost';
import MyPost from './pages/MyPost';

const App = () => {
 
  return (
    <div className="app">    
        <Router>
            <Header />
            <Routes>
                <Route exact path="/" element= {<Home />} />
                <Route exact path="/" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/update/:postId" element={<UpdatePost />} />
                <Route path="/post/:id" element={<FullPost />} /> 
                <Route path='myPost' element={<MyPost />} />
            </Routes>
        </Router>
    </div>
  );
};

export default App;
