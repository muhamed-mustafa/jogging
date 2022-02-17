import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { signUpRouter } from './routes/auth/signup';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { showUsersRouter } from './routes/auth/showByRole';
import { deleteUserRouter } from './routes/auth/deleteByRole';
import { updatedUser } from './routes/auth/updateUser';
import { showUserRouter } from './routes/auth/showUser';
import { newTaskRouter } from './routes/tasks/newTask';
import { updateTaskRouter } from './routes/tasks/updateTask';
import { showTasksRouter } from './routes/tasks/showTasks';
import { deleteTaskRouter } from './routes/tasks/deleteTask';
import { reportTasksRouterByRole } from './routes/report/report.role.route';
import { reportTasksRouter } from './routes/report/report.route';
import { createRunRouter } from './routes/run/new';
import { updateRunRouter } from './routes/run/update';
import { showRunRouter } from './routes/run/show';
import { filterByDate } from './routes/run/filter';
import { deleteRunRouter } from './routes/run/delete';
import { currentUser, errorHandler, NotFoundError } from '@micro-services1/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use([
  json(),
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }),
  signinRouter,
  signUpRouter,
  signoutRouter,
  currentUser,
  showUsersRouter,
  deleteUserRouter,
  updatedUser,
  showUserRouter,
  newTaskRouter,
  updateTaskRouter,
  showTasksRouter,
  deleteTaskRouter,
  reportTasksRouterByRole,
  reportTasksRouter,
  createRunRouter,
  updateRunRouter,
  showRunRouter,
  filterByDate,
  deleteRunRouter
]);

// Middlewares
app.use(
  '*',
  async () => {
    throw new NotFoundError();
} , errorHandler);

export { app };