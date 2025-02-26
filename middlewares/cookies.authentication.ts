import jwt from 'jsonwebtoken';

export const generateToken = (id:string) => {
    return jwt.sign({id},'secretMe',{expiresIn: '1d'});
}

export const generateRefreshToken = (id:string) => {
    return jwt.sign({id},'secretMe',{expiresIn: '3d'});
}