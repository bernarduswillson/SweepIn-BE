# SweepIn-BE

## Class Diagram
<p align="center">
  <img src="docs/class_diagram.jpg" width="70%" height="auto">
</p>

## Project Setup

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

4. Create a `.env` file in the root directory and add the following environment variables

```env
.env.example

DATABASE_URL=mysql://user:password@localhost:3306/mydb
PORT=1337
STORAGE_BUCKET=sweepin.xxx.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```



5. Run the server

```bash
npm run dev
```
