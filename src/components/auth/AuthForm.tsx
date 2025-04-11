import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const FormContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.3s ease-out;
  margin: 0 auto;
  margin-top: 10vh;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin: 0 0 0.75rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 2.5rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const Button = styled.button`
  padding: 0.875rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1.5px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
  margin-top: 0;

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    border-color: ${props => props.theme.colors.text.primary};
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 500;
  text-align: right;
  cursor: pointer;
  padding: 0;
  margin-top: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const MessageContainer = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ErrorMessage = styled(MessageContainer)`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error}10;

  &::before {
    content: '⚠️';
  }
`;

const SuccessMessage = styled(MessageContainer)`
  color: ${props => props.theme.colors.success};
  background: ${props => props.theme.colors.success}10;

  &::before {
    content: '✅';
  }
`;

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setSuccess('Successfully signed in!');
      onSuccess?.();
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess('Password reset email sent! Please check your inbox.');
      setShowResetForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <LogoContainer>
        <Image 
          src="/images/scalemate-logo.png" 
          alt="ScaleMate Logo" 
          width={140} 
          height={40}
          priority
        />
      </LogoContainer>
      {showResetForm ? (
        <>
          <Title>Reset Password</Title>
          <Subtitle>Enter your email address and we'll send you a link to reset your password.</Subtitle>
          <Form onSubmit={handleResetPassword}>
            <InputGroup>
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>
            <SecondaryButton type="button" onClick={() => setShowResetForm(false)}>
              Back to Sign In
            </SecondaryButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </Form>
        </>
      ) : (
        <>
          <Title>Admin</Title>
          <Subtitle>Sign in to access the ScaleMate admin dashboard</Subtitle>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ForgotPasswordLink type="button" onClick={() => setShowResetForm(true)}>
                Forgot your password?
              </ForgotPasswordLink>
            </InputGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </Form>
        </>
      )}
    </FormContainer>
  );
} 