import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import { sendEmail } from '../configs/sendgridConfig.js';

export const createContact = async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;
  if (!name || !email || !phoneNumber || !message) {
    throw new BadRequestError('Please provide all required fields');
  }

  const createContact = await prisma.contact.create({
    data: { name, email, phoneNumber, message },
  });

  const emailSubject = 'E-Commerce | Contact US Details';
  const emailHTML = `
    <h4>New Contact</h4>
    <p>${name}</p>
    <p>${email}</p>
    <p>${phoneNumber}</p>
    <p>${message}</p>
  `;

  await sendEmail(process.env.OWNER_EMAIL, emailSubject, emailHTML);

  res.status(StatusCodes.CREATED).json({ createContact });
};

export const getAllContacts = async (req, res) => {
  const contacts = await prisma.contact.findMany({});
  res.status(StatusCodes.OK).json({ contacts });
};
