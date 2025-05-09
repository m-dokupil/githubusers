import {
  TextField,
  styled,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
  },
}));

type FormValues = {
  username: string;
};

interface SearchBarProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  currentUsername: string;
  handleClearSearch: () => void;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  register,
  errors,
  currentUsername,
  handleClearSearch,
  handleSubmit,
  onSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledTextField
        fullWidth
        placeholder="Search GitHub users..."
        variant="outlined"
        error={!!errors.username}
        helperText={errors.username?.message}
        InputProps={{
          endAdornment: currentUsername && (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={handleClearSearch}
                aria-label="clear search"
                size="small"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...register('username')}
      />
    </form>
  );
};
