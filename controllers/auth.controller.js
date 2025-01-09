import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import { attachCookiesToResponse } from '../utils/jwt.js';
import createTokenUser from '../utils/createTokenUser.js';
import cloudinary from '../configs/cloudinaryConfig.js';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields!');
  }

  // Check if the email exists
  const isEmailExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isEmailExists) {
    throw new BadRequestError('Email is already exists!');
  }

  // Set the first registered user as an admin
  const isFirstAccount = await prisma.user.count();
  const role = isFirstAccount === 0 ? 'ADMIN' : 'USER';

  // Uploading image to the cloud
  let profilePicture = '/uploads/default.jpeg';
  if (req.files && req.files.profilePicture) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.profilePicture.tempFilePath);
    profilePicture = result.secure_url;
  }

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profilePicture,
      role,
    },
  });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide a valid email and password');
  }

  // Check if the user is exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // Comparing password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};
