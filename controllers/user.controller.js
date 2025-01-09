import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import cloudinary from '../configs/cloudinaryConfig.js';
import fs from 'fs';

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      role: true,
      googleId: true,
      reviews: { select: { id: true, rating: true } },
      cart: true,
      orders: true,
      products: { select: { id: true, name: true } },
    },
  });
  res.status(StatusCodes.OK).json({ users });
};

export const getUserById = async (req, res) => {
  const { id: userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      role: true,
      googleId: true,
      reviews: { select: { id: true, rating: true } },
      cart: true,
      orders: true,
      products: { select: { id: true, name: true } },
    },
  });
  if (!user) {
    throw new NotFoundError(`No users found with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const showMe = async (req, res) => {
  const userId = req.user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new BadRequestError(`No users has logged in!`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, password, newPassword } = req.body;
  const findUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!findUser) {
    throw new NotFoundError(`No user found with id: ${id}`);
  }
  let profilePicture = findUser.profilePicture;
  const updateData = {};

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
    updateData.profilePicture = profilePicture;
  }

  if (name) {
    updateData.name = name;
  }

  if (email && email !== findUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      throw new BadRequestError('Email is already in use');
    }
    updateData.email = email;
  }

  if (password && newPassword) {
    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid current password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    updateData.password = hashedNewPassword;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      role: true,
      googleId: true,
      reviews: { select: { id: true, rating: true } },
      cart: true,
      orders: true,
      products: { select: { id: true, name: true } },
    },
    data: { ...updateData },
  });

  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new BadRequestError(`No users found with id ${userId}`);
  }
  const deleteUser = await prisma.user.delete({
    where: { id: userId },
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: `User with id ${userId} has been deleted!` });
};
