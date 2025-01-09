import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';

export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError('Please provide category name!');
  }
  const category = await prisma.category.create({
    data: { name },
  });
  res.status(StatusCodes.CREATED).json({ category });
};

export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany({});
  res.status(StatusCodes.OK).json({ categories });
};

export const getCategoryById = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with id ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

export const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with id ${categoryId}`);
  }

  const updateData = {};
  if (name) {
    updateData.name = name;
  }
  if (description) {
    updateData.description = description;
  }

  const updateCategory = await prisma.category.update({
    where: { id: parseInt(categoryId) },
    data: updateData,
  });
  res.status(StatusCodes.OK).json({ updateCategory });
};

export const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with id ${categoryId}`);
  }
  const deleteCategory = await prisma.category.delete({
    where: { id: parseInt(categoryId) },
  });
  res.status(StatusCodes.OK).json({ msg: 'Category has been deleted' });
};
