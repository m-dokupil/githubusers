import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import '@testing-library/jest-dom';

describe('SearchBar Component', () => {
  const mockRegister = jest.fn().mockReturnValue({});
  const mockHandleSubmit = jest.fn().mockImplementation((callback) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    callback({ username: 'testuser' });
  });
  const mockOnSubmit = jest.fn();
  const mockHandleClearSearch = jest.fn();
  
  const renderSearchBar = (currentUsername = '', errors = {}) => {
    return render(
      <SearchBar
        register={mockRegister}
        errors={errors}
        currentUsername={currentUsername}
        handleClearSearch={mockHandleClearSearch}
        handleSubmit={mockHandleSubmit}
        onSubmit={mockOnSubmit}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search input field correctly', () => {
    renderSearchBar();
    
    const searchInput = screen.getByPlaceholderText('Search GitHub users...');
    expect(searchInput).toBeInTheDocument();
  });

  test('displays error message when username has an error', () => {
    const errors = { username: { message: 'Username is required' } };
    renderSearchBar('', errors);
    
    const errorMessage = screen.getByText('Username is required');
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows clear button when username is provided and clears search when clicked', () => {
    renderSearchBar('testuser');
    
    const clearButton = screen.getByLabelText('clear search');
    expect(clearButton).toBeInTheDocument();
    
    fireEvent.click(clearButton);
    expect(mockHandleClearSearch).toHaveBeenCalledTimes(1);
  });

  test('submits the form with correct data when form is submitted', () => {
    const { container } = renderSearchBar('testuser');
    
    // Get the form element directly from the container
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
      
      expect(mockHandleSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith({ username: 'testuser' });
    }
  });
});
