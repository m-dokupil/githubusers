import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Paper,
  Fade,
  styled,
} from '@mui/material';

const LoaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
}));

const FancyLoader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
}));

interface LoadingIndicatorProps {
  isLoading: boolean;
  isTyping: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, isTyping }) => {
  return (
    <Fade in={isLoading || isTyping} timeout={300}>
      <Box sx={{ display: (isLoading || isTyping) ? 'block' : 'none', mb: 3 }}>
        <LoaderContainer>
          <FancyLoader elevation={3}>
            <CircularProgress size={24} color="primary" />
            <Typography variant="body2">
              {isTyping ? 'Waiting for you to finish typing...' : 'Searching GitHub users...'}
            </Typography>
          </FancyLoader>
          <LinearProgress color="primary" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        </LoaderContainer>
      </Box>
    </Fade>
  );
};
