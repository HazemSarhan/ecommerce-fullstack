import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import bcrypt from 'bcryptjs';

export const createCard = async (req, res) => {
  const { cardHolderName, cardNumber, last4, expireDate, cvv } = req.body;
  if (!cardHolderName || !cardNumber || !expireDate || !cvv) {
    throw new BadRequestError('Please provide all required fields!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedCardNumber = await bcrypt.hash(cardNumber, salt);

  const newCard = await prisma.paymentOptions.create({
    data: {
      cardHolderName,
      cardNumber: hashedCardNumber,
      expireDate,
      cvv: null,
      last4: cardNumber.slice(-4),
    },
  });

  res.status(StatusCodes.CREATED).json({ newCard });
};

export const getAllCards = async (req, res) => {
  const cards = await prisma.paymentOptions.findMany({});
  res.status(StatusCodes.OK).json({ cards });
};

export const getCardById = async (req, res) => {
  const { id: cardId } = req.params;
  const card = await prisma.paymentOptions.findUnique({
    where: { id: parseInt(cardId) },
  });
  if (!card) {
    throw new BadRequestError(`No cards found with this id ${cardId}`);
  }
  res.status(StatusCodes.OK).json({ card });
};

export const deleteCard = async (req, res) => {
  const { id: cardId } = req.params;
  const card = await prisma.paymentOptions.findUnique({
    where: { id: parseInt(cardId) },
  });
  if (!card) {
    throw new BadRequestError(`No cards found with this id ${cardId}`);
  }
  const deleteCard = await prisma.paymentOptions.delete({
    where: { id: parseInt(cardId) },
  });
  res.status(StatusCodes.OK).json({ msg: 'Card has been deleted!' });
};
