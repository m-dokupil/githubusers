import { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grow,
  styled,
} from '@mui/material';
import { GitHubUser } from '../types/github';

const UserCardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flex: '1 0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  margin: theme.spacing(2),
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const ProfileLink = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  padding: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius * 2,
  color: theme.palette.primary.main,
  fontWeight: 200,
  fontSize: '0.75rem',
  textDecoration: 'none',
}));

const UserTypeChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 500,
  fontSize: '0.75rem',
  height: 24,
}));

interface UserCardProps {
  user: GitHubUser;
  isLoading: boolean;
  searchTerm: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, isLoading, searchTerm }) => {
  // Generate random values once per component instance rather than on every render
  const randomDelay = useMemo(() => Math.random() * 300, []);
  const randomOffset = useMemo(() => Math.random() * 20 - 10, []);
  
  return (
    <Grow 
      in={!isLoading} 
      timeout={500}
      style={{ transitionDelay: `${randomDelay}ms` }}
    >
      <Box 
        sx={{ 
          width: { xs: '90%' },
          transform: `translateY(${randomOffset}px)`
        }}
      >
        <UserCardStyled 
          onClick={() => searchTerm && window.open(user.html_url, '_blank', 'noopener,noreferrer')}
        >
          <UserAvatar src={user.avatar_url} alt={user.login} />
          <CardContentStyled>
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                noWrap
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                {user.login}
              </Typography>
              <UserTypeChip 
                label={user.type} 
                size="small" 
                color={user.type === 'User' ? 'primary' : 'secondary'}
                variant="outlined"
              />
            </Box>
            <ProfileLink>
              View Profile →
            </ProfileLink>
          </CardContentStyled>
        </UserCardStyled>
      </Box>
    </Grow>
  );
};