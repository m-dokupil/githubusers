import type { GitHubSearchResponse } from '../types/github';

const GITHUB_API_URL = 'https://api.github.com';

/**
 * Search GitHub users by username
 * @param username - The username to search for
 * @param page - The page number (for pagination)
 * @param perPage - Number of results per page
 * @returns Promise with GitHub search response
 */
export const searchUsers = async (
  username: string,
  page: number = 1,
  perPage: number = 50
): Promise<GitHubSearchResponse> => {
  if (!username.trim()) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }

  try {
    const response = await fetch(
      `${GITHUB_API_URL}/search/users?q=${encodeURIComponent(username)}&page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching GitHub users:', error);
    throw error;
  }
};
