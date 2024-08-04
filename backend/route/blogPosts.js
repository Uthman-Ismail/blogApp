import express from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/authMiddleware.js';


const prisma = new PrismaClient();
const router = express.Router();

// Create a blog post
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;
  const post = await prisma.blogPost.create({
    data: { title, content, authorId: userId },
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
    include: { author: true },
  });

  res.json(posts);
});

// Get a single blog post
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
    include: { author: true },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

// Update a blog post
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId } = req.user;

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post || post.authorId !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updatedPost = await prisma.blogPost.update({
    where: { id: parseInt(id) },
    data: { title, content },
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

export default router;
