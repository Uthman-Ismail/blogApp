import express from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/authMiddleware.js';


const prisma = new PrismaClient();
const router = express.Router();

// Create a blog post
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, description } = req.body;
  const { userId } = req.user;
  const post = await prisma.blogPost.create({
    data: { title, description, content, authorId: userId },
  });
  res.status(201).json(post);
});

// Get all blog posts
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search, author } = req.query;

  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (author) {
    where.author = { email: author };
  }


  const posts = await prisma.blogPost.findMany({
    where,
    skip: parseInt(skip),
    take: parseInt(limit),
    include: { author: {  // Include the author information
      select: {
        id: true,
        name: true, 
      },
    }, },
  });

  res.json(posts);
});

router.get('/mine', authMiddleware, async (req, res) => {
    const { userId } = req.user;
    const authorId = userId;
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          authorId: parseInt(authorId, 10), // Convert authorId to an integer
        },
        include: {
          author: true, // Optional: Include author details if needed
        },
      });
  
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this author' });
      }
  
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving posts', error });
    }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
    include: { author: {  // Include the author information
      select: {
        id: true,
        name: true, 
      },
    }, },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

// Update a blog post
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, description } = req.body;
  const { userId } = req.user;

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post || post.authorId !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updatedPost = await prisma.blogPost.update({
    where: { id: parseInt(id) },
    data: { title, content, description },
  });

  res.json(updatedPost);
});

// Delete a blog post
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post || post.authorId !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await prisma.blogPost.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: 'Post deleted' });
});


//comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(id, 10),
        authorId: userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
});


// id = postid
// Fetch comments for a specific post
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id, 10) },
      include: {
        author: {  // Include the author information
          select: {
            id: true,
            name: true, 
          },
        },
      },
      orderBy: { createdAt: 'asc' }, // to order comments by creation time
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});


router.post('/:id/like', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Check if the user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: parseInt(id, 10),
        userId: userId,
      },
    });

    if (existingLike) {
      // If already liked, remove the like (unlike)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ message: 'Post unliked' });
    }

    // If not liked, add a new like
    const like = await prisma.like.create({
      data: {
        postId: parseInt(id, 10),
        userId: userId,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

// Fetch the number of likes for a specific post
router.get('/:id/likes', async (req, res) => {
  const { id } = req.params;

  try {
    const likeCount = await prisma.like.count({
      where: { postId: parseInt(id, 10) },
    });
    res.status(200).json({ count: likeCount });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Failed to fetch likes' });
  }
});


// Assuming you have authMiddleware to verify JWT and get the user ID
router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId; // Retrieved from the token via authMiddleware
  try {
    // Find the comment by id and author id to ensure the user is the owner
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment || comment.authorId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});


export default router;
