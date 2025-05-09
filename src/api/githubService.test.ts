import { searchUsers } from './githubService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('GitHub Service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers function', () => {
    test('returns empty results when username is empty', async () => {
      // Test with empty username
      const result = await searchUsers('', 1, 10);
      
      // Should return empty results without calling fetch
      expect(result).toEqual({
        total_count: 0,
        incomplete_results: false,
        items: []
      });
      expect(fetch).not.toHaveBeenCalled();
    });

    test('fetches user data from GitHub API successfully', async () => {
      // Mock successful API response
      const mockResponse = {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 123,
            login: 'testuser',
            avatar_url: 'https://example.com/avatar.png',
            html_url: 'https://github.com/testuser',
            type: 'User',
            // Add other required properties
            node_id: 'node123',
            gravatar_id: '',
            url: 'https://api.github.com/users/testuser',
            followers_url: 'https://api.github.com/users/testuser/followers',
            following_url: 'https://api.github.com/users/testuser/following{/other_user}',
            gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
            starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
            subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
            organizations_url: 'https://api.github.com/users/testuser/orgs',
            repos_url: 'https://api.github.com/users/testuser/repos',
            events_url: 'https://api.github.com/users/testuser/events{/privacy}',
            received_events_url: 'https://api.github.com/users/testuser/received_events',
            site_admin: false,
            score: 1
          }
        ]
      };
      
      // Setup mock implementation of fetch
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });
      
      // Call the function with test parameters
      const result = await searchUsers('testuser', 1, 10);
      
      // Verify the fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=testuser&page=1&per_page=10'
      );
      
      // Verify the result matches the mock response
      expect(result).toEqual(mockResponse);
    });

    test('handles API errors correctly', async () => {
      // Mock the console.error to prevent actual error logs during test
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      try {
        // Mock failed API response
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 403
        });
        
        // Call the function and expect it to throw an error
        await expect(searchUsers('testuser', 1, 10)).rejects.toThrow();
        
        // Verify fetch was called
        expect(fetch).toHaveBeenCalledWith(
          'https://api.github.com/search/users?q=testuser&page=1&per_page=10'
        );
        
        // Verify console.error was called
        expect(console.error).toHaveBeenCalled();
      } finally {
        // Restore the original console.error
        console.error = originalConsoleError;
      }
    });
  });
});
