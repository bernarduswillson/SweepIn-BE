# SRE-ITB-backend

## Class Diagram
<p align="center">
  <img src="docs/class_diagram.jpg" width="70%" height="auto">
</p>

## Project Setup (Skip this because it's already done)

1. Initialize Project and Install Dependencies

```bash
npm init -y
npm i express dotenv cors express-validator @prisma/client
npm i -D typescript @types/node @types/express @types/dotenv @types/cors
npm i --save-dev prisma esbuild-register nodemon
```

2. Initialize Prisma

```bash
npx prisma init --datasource-provider mongodb
```

## How to run

1. Install dependencies

```bash
npm install
```

2. Make sure the database is up to date to the schema

```bash
npx prisma db push
```

3. Seed the database (optional)

```bash
npx prisma db seed
```

4. Run the server

```bash
npm run dev
```
