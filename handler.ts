import serverlessHttp from 'serverless-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { userRouter } from './controllers/users';
import { authRouter } from './controllers/auth';
import { onboardingRouter } from './controllers/onboardings';
import { userOnboardingRouter } from './controllers/userOnboardings';

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use(userRouter, authRouter, onboardingRouter, userOnboardingRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Onboarding API is running' });
});

// Export handler for AWS Lambda
export const handler = serverlessHttp(app);
