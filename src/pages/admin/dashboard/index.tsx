import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 1rem;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetricValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetricLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserEmail = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusIndicator = styled.div<{ $status: 'up' | 'down' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${({ theme, $status }) => 
    $status === 'up' ? theme.colors.success : theme.colors.error};
`;

const ServiceStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0.5rem;
`;

const ServiceName = styled.span`
  font-weight: 500;
`;

const LastChecked = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoutButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AdminForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
  }
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
`;

const SuccessMessage = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.875rem;
`;

const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StrengthIndicator = styled.div<{ $strength: number }>`
  height: 4px;
  background: ${({ theme, $strength }) => {
    if ($strength === 0) return theme.colors.error;
    if ($strength === 1) return theme.colors.error;
    if ($strength === 2) return '#FFA500';
    if ($strength === 3) return theme.colors.success;
    return theme.colors.success;
  }};
  width: ${({ $strength }) => ($strength * 25)}%;
  border-radius: 2px;
  transition: all 0.3s ease;
`;

const StrengthLabel = styled.span<{ $strength: number }>`
  font-size: 0.75rem;
  color: ${({ theme, $strength }) => {
    if ($strength === 0) return theme.colors.error;
    if ($strength === 1) return theme.colors.error;
    if ($strength === 2) return '#FFA500';
    if ($strength === 3) return theme.colors.success;
    return theme.colors.success;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const RequirementsList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: 0;
  list-style: none;
`;

const RequirementItem = styled.li<{ $met: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $met }) => $met ? theme.colors.success : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &::before {
    content: '${({ $met }) => $met ? '✓' : '✗'}';
    color: ${({ theme, $met }) => $met ? theme.colors.success : theme.colors.error};
  }
`;

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasAdminPermissions, setHasAdminPermissions] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/admin');
          return;
        }
        setUser(user);

        // Get user's role and permissions
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setDebugInfo({
            error: roleError,
            userId: user.id,
            email: user.email
          });
          return;
        }

        setUserRole(roleData?.role || 'user');
        setHasAdminPermissions(roleData?.role === 'admin' && roleData?.permissions?.includes('*'));
        setDebugInfo({
          userId: user.id,
          email: user.email,
          role: roleData?.role,
          permissions: roleData?.permissions
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
        setDebugInfo({ error });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Mock data for now - replace with actual API calls
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    conversionRate: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [services, setServices] = useState([
    { name: 'API', status: 'up' as const, lastChecked: new Date() },
    { name: 'Database', status: 'up' as const, lastChecked: new Date() },
    { name: 'Auth Service', status: 'up' as const, lastChecked: new Date() }
  ]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [adminCreationError, setAdminCreationError] = useState<string | null>(null);
  const [adminCreationSuccess, setAdminCreationSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    setMetrics({
      totalUsers: 1250,
      activeUsers: 850,
      conversionRate: 68,
    });

    setRecentUsers([
      { email: 'user1@example.com', role: 'admin' },
      { email: 'user2@example.com', role: 'user' },
      { email: 'user3@example.com', role: 'premium' },
    ]);
  }, []);

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);

    // Calculate strength (0-4)
    const strength = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewAdminPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreationError(null);
    setAdminCreationSuccess(null);

    if (!hasAdminPermissions) {
      setAdminCreationError('You do not have permission to create admin accounts');
      return;
    }

    if (!isPasswordValid) {
      setAdminCreationError('Please meet all password requirements');
      return;
    }

    setIsCreatingAdmin(true);

    try {
      // First check if the user has admin permissions
      if (!hasAdminPermissions) {
        throw new Error('Insufficient permissions to create admin accounts');
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: newAdminEmail,
        password: newAdminPassword,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          permissions: ['*']
        }
      });

      if (error) {
        throw error;
      }

      // After creating the user, add their role to the user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'admin',
          permissions: ['*']
        });

      if (roleError) {
        throw roleError;
      }

      setAdminCreationSuccess('Admin account created successfully!');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setPasswordStrength(0);
      setPasswordRequirements({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      setAdminCreationError(
        error instanceof Error 
          ? error.message 
          : 'Failed to create admin account. Please check your permissions.'
      );
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardContainer>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title>Admin Dashboard</Title>
            <Description>Welcome back, {user.email}</Description>
          </div>
          <HeaderActions>
            {debugInfo && (
              <div style={{ marginRight: '1rem', fontSize: '0.8rem', color: '#666' }}>
                <div>User: {debugInfo.email}</div>
                <div>Role: {debugInfo.role}</div>
                <div>Permissions: {JSON.stringify(debugInfo.permissions)}</div>
              </div>
            )}
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </HeaderActions>
        </div>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Key Metrics</CardTitle>
          <Grid>
            <Metric>
              <MetricValue>{metrics.totalUsers}</MetricValue>
              <MetricLabel>Total Users</MetricLabel>
            </Metric>
            <Metric>
              <MetricValue>{metrics.activeUsers}</MetricValue>
              <MetricLabel>Active Users</MetricLabel>
            </Metric>
            <Metric>
              <MetricValue>{metrics.conversionRate}%</MetricValue>
              <MetricLabel>Conversion Rate</MetricLabel>
            </Metric>
          </Grid>
        </Card>

        <Card>
          <CardTitle>Recent Users</CardTitle>
          <UserList>
            {recentUsers.map((user, index) => (
              <UserItem key={index}>
                <UserInfo>
                  <UserEmail>{user.email}</UserEmail>
                  <UserRole>{user.role}</UserRole>
                </UserInfo>
              </UserItem>
            ))}
          </UserList>
        </Card>

        <Card>
          <CardTitle>System Status</CardTitle>
          <UserList>
            {services.map((service, index) => (
              <ServiceStatus key={index}>
                <ServiceName>{service.name}</ServiceName>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusIndicator $status={service.status} />
                  <LastChecked>
                    Last checked: {service.lastChecked.toLocaleTimeString()}
                  </LastChecked>
                </div>
              </ServiceStatus>
            ))}
          </UserList>
        </Card>

        {hasAdminPermissions ? (
          <Card>
            <CardTitle>Create Admin Account</CardTitle>
            <AdminForm onSubmit={handleCreateAdmin}>
              <FormGroup>
                <FormLabel htmlFor="admin-email">Email Address</FormLabel>
                <FormInput
                  id="admin-email"
                  type="email"
                  placeholder="newadmin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="admin-password">Password</FormLabel>
                <FormInput
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={newAdminPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <PasswordStrength>
                  <StrengthIndicator $strength={passwordStrength} />
                  <StrengthLabel $strength={passwordStrength}>
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Medium'}
                    {passwordStrength === 3 && 'Strong'}
                    {passwordStrength === 4 && 'Very Strong'}
                  </StrengthLabel>
                  <RequirementsList>
                    <RequirementItem $met={passwordRequirements.minLength}>
                      At least 8 characters
                    </RequirementItem>
                    <RequirementItem $met={passwordRequirements.hasUpperCase}>
                      At least one uppercase letter
                    </RequirementItem>
                    <RequirementItem $met={passwordRequirements.hasLowerCase}>
                      At least one lowercase letter
                    </RequirementItem>
                    <RequirementItem $met={passwordRequirements.hasNumber}>
                      At least one number
                    </RequirementItem>
                    <RequirementItem $met={passwordRequirements.hasSpecialChar}>
                      At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                    </RequirementItem>
                  </RequirementsList>
                </PasswordStrength>
              </FormGroup>
              <SubmitButton 
                type="submit" 
                disabled={isCreatingAdmin || !isPasswordValid}
              >
                {isCreatingAdmin ? 'Creating...' : 'Create Admin Account'}
              </SubmitButton>
              {adminCreationError && <ErrorMessage>{adminCreationError}</ErrorMessage>}
              {adminCreationSuccess && <SuccessMessage>{adminCreationSuccess}</SuccessMessage>}
            </AdminForm>
          </Card>
        ) : (
          <Card>
            <CardTitle>Admin Permissions Required</CardTitle>
            <p style={{ color: 'var(--colors-error)' }}>
              You do not have permission to create admin accounts. Please contact a system administrator.
            </p>
          </Card>
        )}
      </Grid>
    </DashboardContainer>
  );
};

export default AdminDashboard; 