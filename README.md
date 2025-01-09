[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/HazemSarhan/ecommerce-fullstack"></a>

<h3 align="center">[Ecommerce API]</h3>

  <p align="center">
    An advanced E-Commerce platform built with HTML, CSS, Bootstrap 5, Node.js, Express, Prisma ORM, and PostgreSQL, offering dynamic features for product management, user authentication, shopping cart functionality, and Stripe-based payment processing. The project also includes a fully functional admin panel and an intuitive user interface built with modern web development practices.
    <br />
    <a href="https://ecommerce-fullstack-4v1t.onrender.com/"><strong>Live Demo »</strong></a>
    <h5>email: hazem@admin.com, password: secret</h5>
    <br />
    <a href="http://localhost:3000/api-docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://documenter.getpostman.com/view/36229537/2sAYQUqERW">Postman Docs</a>
    ·
    <a href="https://github.com/HazemSarhan/ecommerce-fullstack/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/HazemSarhan/ecommerce-fullstack/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Features

Built with:

<div align="center">
  <img src="https://skillicons.dev/icons?i=html,css,bootstrap,js,nodejs,express,postgres,prisma" /><br>
</div>

## Images
<img src="https://i.imgur.com/EOxBxUP.jpeg" alt="Image">


## Getting Started

- Node.js: Version 18 or higher
- PostgreSQL: Ensure a PostgreSQL database is available
- Prisma: ORM for database interactions

## Installation :

1. Clone the repository:

```sh
git clone https://github.com/HazemSarhan/ecommerce-fullstack.git
```

2. Navigate into the project directory:

```sh
cd ecommerce-fullstack
```

3. Install dependencies:

```sh
npm install
```

4. Set up environment variables:
   Check: [Environment Variables](#environment-variables)

5. Initialize the database and generate Prisma client:

```sh
npx prisma migrate dev --name init
npx prisma generate
```

6. Start the server:

```sh
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT = 5000
JWT_SECRET = your-jwt-secret-key
JWT_LIFETIME = 1d
DATABASE_URL = your-db-connection-url
CLOUD_NAME = your-cloudinary-api-cloud-name
CLOUD_API_KEY = your-cloudinary-api-cloud-key
CLOUD_API_SECRET = your-cloudinary-api-cloud-secret-key
SESSION_SECRET = session-secret-key
SENDGRID_API_KEY = sendgrid-api-key
OWNER_EMAIL = your-email


```

## Routes

> [!NOTE]
> Check the docs for all routes & data [API Documentation](https://documenter.getpostman.com/view/36229537/2sAYQUqERW).

## Usage

After creating .env with all [Environment Variables](#environment-variables) :

1. Run the server using:

```sh
npm run dev
```

2. Register a new user.

> [!TIP]
> First registered account role will automatically set to => ADMIN

[contributors-shield]: https://img.shields.io/github/contributors/HazemSarhan/ecommerce-fullstack?style=for-the-badge
[contributors-url]: https://github.com/HazemSarhan/ecommerce-fullstack/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HazemSarhan/ecommerce-fullstack.svg?style=for-the-badge
[forks-url]: https://github.com/HazemSarhan/ecommerce-fullstack/network/members
[stars-shield]: https://img.shields.io/github/stars/HazemSarhan/ecommerce-fullstack.svg?style=for-the-badge
[stars-url]: https://github.com/HazemSarhan/ecommerce-fullstack/stargazers
[issues-shield]: https://img.shields.io/github/issues/HazemSarhan/ecommerce-fullstack.svg?style=for-the-badge
[issues-url]: https://github.com/HazemSarhan/ecommerce-fullstack/issues
[license-shield]: https://img.shields.io/github/license/HazemSarhan/ecommerce-fullstack.svg?style=for-the-badge
[license-url]: https://github.com/HazemSarhan/ecommerce-fullstack/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/hazemmegahed/
[product-screenshot]: images/screenshot.png
[node-js]: https://svgur.com/i/19bZ.svg
[express-js]: https://svgur.com/i/19a1.svg
[mongo-db]: https://svgur.com/i/19b4.svg
[jwt]: https://svgshare.com/i/19bi.svg
[db]: https://i.imgur.com/0CzwXXA.png
