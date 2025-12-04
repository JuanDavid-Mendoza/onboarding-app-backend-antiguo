import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { userRouter } from './users';
import { authRouter } from './auth';
import { onboardingRouter } from './onboardings';
import { userOnboardingRouter } from './userOnboardings';

const app = express();
const port = '3030';

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use(userRouter, authRouter, onboardingRouter, userOnboardingRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});