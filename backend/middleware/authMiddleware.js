import { verifyToken } from "../auth.js";

const jwt_secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try{
        const payload = verifyToken(token, jwt_secret);
        req.user = payload;
        next();
    }catch(err){
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware;