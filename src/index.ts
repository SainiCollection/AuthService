import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import defaultRoute from './routes/default.route'
import signupRoute from './routes/signup.route'
import loginRoute from './routes/login.route'
import forgotPasswordRoute from './routes/forgotPassword.route'
import resetPasswordRoute from './routes/forgotPassword.route'
import deactivateUserAccountRoute from './routes/accountDeactivate.route'
import reactivateUserAccountRoute from './routes/accountDeactivate.route'
import deleteAccountService from './routes/deleteAccount.route';
import recoverAccountRoute from './routes/deleteAccount.route';
import suspendAccountRoute from './routes/suspendAccount.route'
import unsuspendAccountRoute from './routes/suspendAccount.route'
import recoveryEmailRoute from './routes/recoveryEmail.route';
import pool from './config/pgDatabase/dbConnect'; // Import the database pool
import { swaggerSpec, swaggerUi } from './swagger';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
// cors
app.use(cors())

// middleware body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT ;
const BASE_URL_SERVER = process.env.BASE_URL_SERVER ;

// Swagger route---------------------------------------------------SWAGGER ROUTE "/api/v1/auth/docs"
app.use('/api/v1/auth/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// default route------------------------------------------------------------------DEFAULT ROUTE "/"
app.use('/',defaultRoute)

// signup root -------------------------------------------------------------------SIGNUP ROUTE "/api/v1/auth/signup"
app.use("/api/v1/auth",signupRoute)
// signup(app, pool)

// login route--------------------------------------------------------------------LOGIN ROUTE "/api/v1/auth/signup"
app.use("/api/v1/auth", loginRoute)

// forgot password route----------------------------------------------------------FORGOT PASSWORD '/api/v1/auth/forgotpsd'
app.use('/api/v1/auth',forgotPasswordRoute)
app.use('/api/v1/auth',resetPasswordRoute)

// deactivate account route----------------------------------------------------DEACTIVATE ACCOUNT '/api/v1/auth/deactivate-account'
app.use('/api/v1/auth',deactivateUserAccountRoute)
app.use('/api/v1/auth',reactivateUserAccountRoute)

// delete account route----------------------------------------------------DELETE ACCOUNT '/api/v1/auth/delete-account'
app.use('/api/v1/auth',deleteAccountService)
app.use('/api/v1/auth',recoverAccountRoute)

// suspend account route----------------------------------------------------SUSPEND ACCOUNT '/api/v1/auth/suspend-account'
app.use('/api/v1/auth',suspendAccountRoute)
app.use('/api/v1/auth',unsuspendAccountRoute)

// recovery Email route----------------------------------------------------RECOVERY EMAIL '/api/v1/auth/recovery-email'
app.use('/api/v1/auth', recoveryEmailRoute)


server.listen(PORT, () => {
  console.log(`AuthService is running on URL ${BASE_URL_SERVER}`);
});
