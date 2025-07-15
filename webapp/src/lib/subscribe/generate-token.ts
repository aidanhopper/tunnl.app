import jwt from 'jsonwebtoken';

const SECRET = process.env.PUBLISHER_JWT_SECRET || 'secret';

const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

export default generateToken;
