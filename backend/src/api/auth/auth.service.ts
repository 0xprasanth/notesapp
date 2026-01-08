import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import { AppError } from '@/middlewares/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_SECRET_EXPIRATION = process.env.JWT_SECRET_EXPIRATION;


interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface AccessTokenUser {
  email: string;
  [key: string]: any; // Allow optional fields
}

class AuthService {
  private generateToken(user: AccessTokenUser) {
    return jwt.sign(user, JWT_SECRET, {
      expiresIn: JWT_SECRET_EXPIRATION || "1h",
    } as jwt.SignOptions as jwt.SignOptions);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create new user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    // Find user with password field
    const user = await User.findOne({ email: data.email }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(data.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }
}

export default new AuthService();