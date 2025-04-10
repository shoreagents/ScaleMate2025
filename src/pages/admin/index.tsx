import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { supabase } from '@/lib/supabase';
import AuthForm from '@/components/admin/AuthForm';
import UserManagement from '@/components/admin/UserManagement';

// Layout components
const Container = styled.div`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  font-family: ${props => props.theme.fonts?.sans || 'var(--font-sans)'};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border || 'var(--border-color)'};
  padding-bottom: ${props => props.theme.spacing.md};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.9rem;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  transition: all ${props => props.theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.main`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.lg};
  min-height: 300px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Define admin tabs
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'User Management' },
  { id: 'content', label: 'Content Management' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'System Settings' },
  { id: 'logs', label: 'System Logs' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderActiveTabContent = () => {
    if (!isAuthenticated) {
      return <AuthForm />;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <StatsGrid>
            <StatCard>
              <StatTitle>Total Users</StatTitle>
              <StatValue>1,234</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Active Users</StatTitle>
              <StatValue>789</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>New Signups</StatTitle>
              <StatValue>56</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Conversion Rate</StatTitle>
              <StatValue>12.5%</StatValue>
            </StatCard>
          </StatsGrid>
        );
      case 'users':
        return <UserManagement />;
      case 'content':
        return <div>Content Management Content</div>;
      case 'analytics':
        return <div>Analytics Content</div>;
      case 'settings':
        return <div>System Settings Content</div>;
      case 'logs':
        return <div>System Logs Content</div>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>Loading...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      {isAuthenticated && (
        <>
          <Header>
            <Title>Admin Dashboard</Title>
            <Description>Manage your ScaleMate platform</Description>
          </Header>
          <TabContainer>
            {TABS.map(tab => (
              <Tab
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabContainer>
        </>
      )}
      <MainContent>
        {renderActiveTabContent()}
      </MainContent>
    </Container>
  );
} 