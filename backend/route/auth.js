import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', async (req, res) => {
    const email = req.body.email;

    const existingUser = await prisma.user.findUnique({where: {email: email}});
    if(existingUser){
        return ;
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
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // User with the provided email was not found
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            // Password is incorrect\
            return res.status(401).json({ message: 'Incorrect password' });   
        }

        // Generate token since the email and password are valid
        const token = generateToken(user);
        res.json({ message: 'Login successful', token });

    } catch (err) {
        // Handle any unexpected errors
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;