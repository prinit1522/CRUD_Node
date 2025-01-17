import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const ValidateSignature = (req: Request, res: Response, next: NextFunction): void => {
    const signature = req.get('Authorization');

    if (signature) {
        try {
            const token = signature.split(' ')[1];
            const payload = jwt.verify(token, 'secretkey'); // Synchronous verification
            (req as any).user = payload; // Attach payload to request object
            next(); // Pass control to the next middleware or route handler
        } catch (err) {
            res.status(401).json({ message: 'Unauthorized: Invalid Token' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized: No Token Provided' });
    }
};
