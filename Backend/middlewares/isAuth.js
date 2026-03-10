import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const token = req.cokkies.token;
        if (!token) {
            return res.status(400).json({ message: 'Token not found' });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;

        next();
    } catch (error) {
        console.error('Error in isAuth middleware:', error);
        return res.status(500).json({ message: 'Invalid token' });
    }
};

export default isAuth;