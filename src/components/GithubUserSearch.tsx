import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InfiniteScroll from 'react-infinite-scroller';
import {
  Box,
  CircularProgress,
  Alert,
  Container,
  styled,
  Fade,
  useTheme,
  Typography,
  Grid,
} from '@mui/material';
import { useGithubUsers } from '../hooks/useGithubUsers';
import { SearchBar } from './SearchBar';
import { UserCard } from './UserCard';
import { LoadingIndicator } from './LoadingIndicator';

// Form validation schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
});

type FormValues = {
  username: string;
};

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'sticky',
  top: theme.spacing(2),
  zIndex: 10,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: theme.spacing(4),
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const GithubUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
    },
  });

  const currentUsername = watch('username');

  const {
    users,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGithubUsers({
    username: searchTerm,
    enabled: !!searchTerm && isSearching,
  });

  useEffect(() => {
    if (isLoading) {
      setIsTyping(false);
    }
  }, [isLoading]);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    
    if (currentUsername) {
      setIsTyping(true);
      
      // Start search after 2 second of no typing
      debounceTimer = setTimeout(() => {
        setSearchTerm(currentUsername);
        setIsSearching(true); // Set isSearching to true to trigger the API call
      }, 2000);
    } else {
      setIsTyping(false);
      setIsSearching(false);
      setSearchTerm('');
    }
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [currentUsername]);

  useEffect(() => {
    if (users.length > 0) {
      setIsTyping(false);
    }
  }, [users]);
  
  const onSubmit = (data: FormValues) => {
    setSearchTerm(data.username);
    setIsSearching(true);
    setIsTyping(false);
  };
  
  const handleClearSearch = () => {
    setValue('username', '');
    setSearchTerm('');
    setIsSearching(false);
    reset();
  };
  
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Title variant="h4">
        GitHub Users Search
      </Title>
      <Box sx={{ py: 4 }}>
        <SearchContainer>
          <SearchBar 
            register={register} 
            errors={errors} 
            currentUsername={currentUsername} 
            handleClearSearch={handleClearSearch} 
            handleSubmit={handleSubmit} 
            onSubmit={onSubmit} 
          />
        </SearchContainer>
        
        <LoadingIndicator 
          isLoading={isLoading} 
          isTyping={isTyping} 
        />

        <Fade in={isError && !isLoading} timeout={500}>
          <Box sx={{ display: (isError && !isLoading) ? 'block' : 'none', mb: 3 }}>
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ borderRadius: theme.shape.borderRadius * 2 }}
            >
              {error?.message || 'An error occurred while searching for users'}
            </Alert>
          </Box>
        </Fade>

        <Fade in={!isLoading && !isTyping && users.length === 0 && !!searchTerm && !!isSearching} timeout={500}>
          <Box sx={{ display: (!isLoading && !isTyping && users.length === 0 && !!searchTerm && !!isSearching) ? 'block' : 'none', mb: 3 }}>
            <Alert 
              severity="info" 
              variant="filled"
              sx={{ borderRadius: theme.shape.borderRadius * 2 }}
            >
              No users found matching '{searchTerm}'
            </Alert>
          </Box>
        </Fade>

        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            // Only fetch next page if we're not already loading and there are more pages
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage();
            }
          }}
          hasMore={!!hasNextPage}
          loader={
            <Box display="flex" justifyContent="center" my={3} key={0}>
              <CircularProgress size={30} color="primary" />
            </Box>
          }
          threshold={500} // Load more when user is 500px from bottom to reduce API calls
        >
          <Grid
            container
            spacing={3}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: !searchTerm ? 0 : 1,
              transform: !searchTerm ? 'scale(0.8)' : '',
              transformOrigin: 'top',
              transition: 'opacity 0.6s ease-in-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isLoading={isLoading}
                searchTerm={searchTerm}
              />
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
    </Container>
  );
};

export default GithubUserSearch;
