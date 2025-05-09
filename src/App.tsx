import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import GithubUserSearch from './components/GithubUserSearch'

function App() {
  // Create a client with optimized settings
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Prevents refetching when window regains focus
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
        retry: 1, // Only retry failed requests once
      },
    },
  }), [])
  
  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
    },
    // Optimize component rendering
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true, // Disable ripple effect for better performance
        },
      },
    },
  }), [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GithubUserSearch />
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
