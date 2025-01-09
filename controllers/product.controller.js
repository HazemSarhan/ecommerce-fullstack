import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import cloudinary from '../configs/cloudinaryConfig.js';
import fs from 'fs';

export const createProduct = async (req, res) => {
  const userId = req.user.userId;
  const {
    name,
    price,
    totalPrice,
    discountId,
    about,
    quantity,
    bestSelling,
    categoryId,
  } = req.body;

  if (!name || !price || !about || !quantity || !categoryId) {
    throw new BadRequestError('Please provide all required fields');
  }

  const aboutArray = Array.isArray(about)
    ? about
    : about.split(',').map((item) => item.trim());

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with id ${categoryId}`);
  }

  const isBestSelling = bestSelling === 'true';

  let finalPrice = parseFloat(price);
  if (discountId) {
    const discount = await prisma.discount.findUnique({
      where: { id: parseInt(discountId) },
    });
    if (!discount) {
      throw new NotFoundError(`No discount found with id ${discountId}`);
    }

    // Apply discount percentage
    const discountAmount = (finalPrice * discount.discount) / 100;
    finalPrice = finalPrice - discountAmount;
  }

  const stockAvailablity = quantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';

  let picture = '/uploads/default-product.jpeg';
  if (req.files && req.files.picture) {
    const result = await cloudinary.uploader.upload(
      req.files.picture.tempFilePath,
      {
        use_filename: true,
        folder: 'product-images',
      }
    );
    fs.unlinkSync(req.files.picture.tempFilePath);
    picture = result.secure_url;
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      totalPrice: finalPrice,
      discountId: discountId ? parseInt(discountId) : null,
      about: aboutArray,
      quantity: parseInt(quantity),
      stockAvailablity,
      bestSelling: isBestSelling || false,
      picture,
      userId,
      categoryId: parseInt(categoryId),
    },
  });

  // Respond with the created product
  res.status(StatusCodes.CREATED).json({ product });
};

export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({});
  res.status(StatusCodes.OK).json({ products });
};

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });
  if (!product) {
    throw new NotFoundError(`No product found with this id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });
  if (!product) {
    throw new NotFoundError(`No product found with this id ${productId}`);
  }
  const deleteProduct = await prisma.product.delete({
    where: { id: parseInt(productId) },
  });
  res.status(StatusCodes.OK).json({ msg: 'Product has been deleted!' });
};
