import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', async (req, res) => {
    const email = req.body.email;

    const existingUser = await prisma.user.findUnique({where: {email: email}});
    if(existingUser){
        return res.status(400).json({ message: 'Email already in use' });
    }

    const {name, password} = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    });
    
    res.status(201).json({ message: 'User registered', user });
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email: email}});
    if(!user || !(await comparePassword(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
});

export default router;