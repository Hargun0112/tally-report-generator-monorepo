import { Link } from 'react-router-dom';
import { RegisterUser } from '@fullstack_package/interfaces';
import { useState, ChangeEvent, FormEvent } from 'react';
import clsx from 'clsx';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingSpinner
} from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then } from '@/components/utility';

export const SignupForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp } = useAuth();

  const [registerData, setRegisterData] = useState<RegisterUser>({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUp)
      signUp(registerData, {
        onSettled(d, e, v, c) {
          setLoading(false);
        }
      });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleFormChange}
                  placeholder="Max"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  name="last_name"
                  value={registerData.last_name}
                  onChange={handleFormChange}
                  placeholder="Robinson"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleFormChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleFormChange}
                type="password"
              />
            </div>
            <Button
              type="submit"
              className={clsx(
                loading && 'cursor-default pointer-events-none',
                'w-full'
              )}
            >
              <If condition={loading}>
                <Then>
                  <LoadingSpinner />
                </Then>
                <Else>Create an Account</Else>
              </If>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
