import User from '../models/user.model.js';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        // Fetch user data from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }
        
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(400).json({ message: 'Internal server error' });
    }
};