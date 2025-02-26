import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Register from '../models/register.schema';

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const ValidateSignature = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const signature = req.get('Authorization');

    if (!signature) {
        res.status(401).json({ message: 'Unauthorized: No Token Provided' });
        return;
    }

    try {
        const token = signature.split(' ')[1];

        // Decode token without verifying (useful for debugging)
        const decodedToken: any = jwt.decode(token);
        console.log("Decoded Token:", decodedToken);

        const decoded = jwt.verify(token, "secretkey") as { _id: string };
        const user = await Register.findById(decoded._id);

        if (!user || user.token !== token) {
            res.status(401).json({ message: "Session Expired. Please log in again." });
            return 
        }

        (req as any).user = decoded; // Attach user data to request
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        res.status(401).json({ message: 'Unauthorized: Invalid Token' });
        return;
    }
};
