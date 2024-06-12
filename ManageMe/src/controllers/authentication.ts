import { Request, Response } from 'express';
import { getUserByEmail, createUser } from '../models/UserDb';
import crypto from 'crypto';

const SECRET = "MANAGE-ME-API";

export const authentication = (salt: string, password: string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

const random = () => crypto.randomBytes(128).toString('base64');

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('MANAGE-ME-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).send({ email: user.email, username: user.username, role: user.role }); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, role } = req.body;

    if (!email || !password || !username || !role) {
      return res.status(400).send({ message: 'Email, username and password are required ' });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      role,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(201).send({ email: user.email, username: user.username, role: user.role }); 
  } catch (error) {
    console.error('Error in register function:', error);
    if (!res.headersSent) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('MANAGE-ME-AUTH', { domain: 'localhost', path: '/' });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
