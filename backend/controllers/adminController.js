import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ userType: { $in: ['admin', 'super-admin'] } })
            .select('name email rollNo profilePhoto userType')
            .sort({ userType: -1, name: 1 });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

export const searchUsersForAdmin = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const regex = new RegExp(q, 'i');

        const users = await User.find({
            $and: [
                { $or: [{ name: regex }, { rollNo: regex }, { email: regex }] },
                { userType: { $nin: ['admin', 'super-admin'] } }
            ]
        })
            .limit(20)
            .select('name email rollNo profilePhoto userType');

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};

export const updateAdminRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'super-admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        if (req.user._id === req.params.id) {
            res.status(500).json({ error: "Update failed" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { userType: role },
            { new: true }
        ).select('name email rollNo profilePhoto userType');

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
};

export const removeAdminRole = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { userType: '' },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Admin privileges removed" });
    } catch (err) {
        res.status(500).json({ error: "Remove failed" });
    }
}
export const createSetupSuperAdmin = async (req, res) => {
    try {
        const { user, pass } = req.query;
        const token = req.cookies.token;

        if (!token) {
            return res.status(201).json({
                message: 'Unauthorized: No token provided, Please login'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const targetUser = await User.findById(decoded.id);
        if (!targetUser) {
            res.clearCookie('token');
            return res.status(201).json({
                message: 'User not found'
            });
        }
        if (!targetUser.isVerified) {
            res.clearCookie('token');
            return res.status(201).json({
                message: 'Please verify your account first'
            });
        }
        if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
            return res.status(401).json({ error: "Unauthorized access" });
        }


        targetUser.userType = 'super-admin';
        await targetUser.save();
        return res.status(200).json({
            message: "Existing user upgraded to super-admin",
            name: targetUser.name,
            email: targetUser.email
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" });
    }
};