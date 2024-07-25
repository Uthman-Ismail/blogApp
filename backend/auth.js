import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET;

export const hashPassword =  async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

export const generateToken = (user) => {
    return jwt.sign({userId: user.id}, jwt_secret, {expiresIn: '3 days'});
}

export const verifyToken = (token) => {
    return jwt.verify(token, jwt_secret);
}