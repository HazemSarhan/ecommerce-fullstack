import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';

export const createDiscount = async (req, res) => {
  const { code, discount } = req.body;
  if (!code || !discount) {
    throw new BadRequestError('Please provide all required fields!');
  }
  const createDiscount = await prisma.discount.create({
    data: { code, discount },
  });
  res.status(StatusCodes.OK).json({ createDiscount });
};

export const getAllDiscounts = async (req, res) => {
  const discounts = await prisma.discount.findMany({});
  res.status(StatusCodes.OK).json({ discounts });
};

export const getDiscountById = async (req, res) => {
  const { id: discountId } = req.params;
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(discountId) },
  });
  if (!discount) {
    throw new NotFoundError(`No discounts found with this id ${discountId}`);
  }
  res.status(StatusCodes.OK).json({ discount });
};

export const deleteDiscount = async (req, res) => {
  const { id: discountId } = req.params;
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(discountId) },
  });
  if (!discount) {
    throw new NotFoundError(`No discounts found with this id ${discountId}`);
  }
  const deleteDiscount = await prisma.discount.delete({
    where: { id: parseInt(discountId) },
  });
  res.status(StatusCodes.OK).json({ msg: 'Discount has been deleted!' });
};
