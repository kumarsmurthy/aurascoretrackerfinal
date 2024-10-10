import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { kv } from '@vercel/kv';
import { hash, compare } from 'bcrypt';

// KV utility functions
async function createUser(email: string, password: string) {
  const hashedPassword = await hash(password, 10);
  await kv.hset(`user:${email}`, {
    email,
    password: hashedPassword,
  });
}

async function getUser(email: string) {
  return kv.hgetall(`user:${email}`);
}

async function verifyPassword(email: string, password: string) {
  const user = await getUser(email);
  if (!user) return false;
  return compare(password, user.password);
}

async function saveAuraScore(email: string, date: string, score: number) {
  await kv.lpush(`aura_scores:${email}`, JSON.stringify({ date, score }));
}

async function getAuraScores(email: string) {
  const scores = await kv.lrange(`aura_scores:${email}`, 0, -1);
  return scores.map(score => JSON.parse(score));
}

// AuthForm component
const AuthForm: React.FC<{ onAuth: (user: { email: string }) => void }> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isLogin) {
        const isValid = await verifyPassword(email, password);
        if (isValid) {
          onAuth({ email });
        } else {
          setError('Invalid credentials');
        }
      } else {
        await createUser(email, password);
        onAuth({ email });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Log in to AuraScore" : "Sign up for AuraScore"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button
            variant="link"
            className="ml-1 p-0"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
