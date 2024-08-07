import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes } from './components/utility';
import {
  SignupForm,
  SigninForm,
  ForgotPassword,
  ResetPassword
} from './views/Authentication';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/">
        <Route index element={<Navigate to="/dashboard" />} />
        <Route element={<PublicRoutes />}>
          <Route path="sign-up" element={<SignupForm />} />
          <Route path="sign-in" element={<SigninForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
