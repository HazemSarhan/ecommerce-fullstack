import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import express from 'express';
const app = express();

// Rest of packages
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

// Middlewares
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import { checkAuthentication } from './middleware/authentication.js';

// EJS Configurations
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import addressRoutes from './routes/address.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import discountRoutes from './routes/discount.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import orderRoutes from './routes/order.routes.js';
import contactRoutes from './routes/contact.routes.js';

app.use(express.static('./public'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);
app.use(checkAuthentication);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/discount', discountRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/contact', contactRoutes);

app.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({});
  const discountedProducts = await prisma.product.findMany({
    where: {
      discountId: {
        not: null,
      },
    },
    include: {
      discount: true,
    },
    take: 9,
  });
  const bestSellingProducts = await prisma.product.findMany({
    where: {
      bestSelling: true,
    },
    take: 4,
  });

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
    include: { reviews: true, discount: true },
  });

  res.render('index', {
    currentPage: 'index',
    title: 'Home',
    categories,
    discountedProducts,
    bestSellingProducts,
    products,
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { currentPage: 'contact', title: 'Contact' });
});

app.get('/about', (req, res) => {
  res.render('about', { currentPage: 'about', title: 'About' });
});

app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({
    take: 8,
    include: { discount: true },
  });
  res.render('products', {
    currentPage: 'products',
    title: 'Products',
    products,
  });
});
app.get('/single-product/:id', async (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).render('error', {
      currentPage: 'error',
      title: 'Invalid Product ID',
      message: 'The provided product ID is not valid.',
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).render('error', {
        currentPage: 'error',
        title: 'Product Not Found',
        message: 'The product you are looking for does not exist.',
      });
    }

    res.render('single-product', {
      currentPage: 'single-product',
      title: product.name || 'Product Details',
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).render('error', {
      currentPage: 'error',
      title: 'Error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
});

app.get('/sign-up', (req, res) => {
  res.render('sign-up', { currentPage: 'sign-up', title: 'Sign-up' });
});

app.get('/login', (req, res) => {
  res.render('login', { currentPage: 'login', title: 'Login' });
});
app.get('/cart', async (req, res) => {
  try {
    // Ensure the user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }

    // Fetch the cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }, // Include product details
    });

    // Calculate cart totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.render('cart', {
      currentPage: 'cart',
      title: 'Cart',
      cartItems,
      subtotal,
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/wishlist', (req, res) => {
  res.render('wishlist', { currentPage: 'wishlist', title: 'Wishlist' });
});

app.get('/account', checkAuthentication, async (req, res) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      role: true,
    },
  });

  res.render('account', { currentPage: 'account', title: 'Account', user });
});

app.get('/account-address', async (req, res) => {
  const userId = req.user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { address: true },
  });
  res.render('account-address', {
    currentPage: 'account-address',
    title: 'Address',
    address: user.address,
  });
});

app.get('/account-payment', async (req, res) => {
  const card = await prisma.paymentOptions.findMany({});
  res.render('account-payment', {
    currentPage: 'account-payment',
    title: 'Payments',
    card,
  });
});

app.get('/orders', async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.render('orders', { currentPage: 'orders', title: 'Orders', orders });
});

app.get('/success', async (req, res) => {
  try {
    const orderId = req.query.order_id;
    if (!orderId) {
      return res.status(400).json({ msg: 'Invalid order ID' });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    console.log(order); // Debugging
    res.render('order-success', {
      order,
      title: 'Order Success',
      currentPage: 'order-success',
    });
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res, next) => {
  res.status(404).render('not-found', { currentPage: '', title: 'Not-Found' });
});
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const serverStart = async () => {
  try {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
};

serverStart();
