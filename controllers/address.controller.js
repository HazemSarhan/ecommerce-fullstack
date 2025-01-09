import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';

export const createAddress = async (req, res) => {
  const userId = req.user.userId;
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    emailAddress,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !address ||
    !city ||
    !state ||
    !zipCode ||
    !phoneNumber ||
    !emailAddress
  ) {
    throw new BadRequestError('Please provide all required fields');
  }

  const newAddress = await prisma.address.create({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
      emailAddress,
      userId,
    },
  });
  res.status(StatusCodes.OK).json({ newAddress });
};

export const getAllAddresses = async (req, res) => {
  const addresses = await prisma.address.findMany({});
  res.status(StatusCodes.OK).json({ addresses });
};

export const getAddressById = async (req, res) => {
  const { id: addressId } = req.params;
  const address = await prisma.address.findUnique({
    where: { id: parseInt(addressId) },
  });
  if (!address) {
    throw new NotFoundError(`No addresses found with this id ${addressId}`);
  }
  res.status(StatusCodes.OK).json({ address });
};

export const deleteAddress = async (req, res) => {
  const { id: addressId } = req.params;
  const address = await prisma.address.findUnique({
    where: { id: parseInt(addressId) },
  });
  if (!address) {
    throw new NotFoundError(`No addresses found with this id ${addressId}`);
  }

  const deleteAddress = await prisma.address.delete({
    where: { id: parseInt(addressId) },
  });
  res.status(StatusCodes.OK).json({ msg: `Address has been deleted` });
};
