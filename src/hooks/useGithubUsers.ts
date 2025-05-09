import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { searchUsers } from '../api/githubService';
import { GitHubUser } from '../types/github';

const DEBOUNCE_TIME = 500;

interface UseGithubUsersProps {
  username: string;
  enabled?: boolean;
}

interface UseGithubUsersResult {
  users: GitHubUser[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const useGithubUsers = ({
  username,
  enabled = true,
}: UseGithubUsersProps): UseGithubUsersResult => {
  const [debouncedUsername, setDebouncedUsername] = useState(username);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce the username input by 500ms
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedUsername(username);
    }, DEBOUNCE_TIME);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [username]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['githubUsers', debouncedUsername],
    queryFn: ({ pageParam = 1 }) => searchUsers(debouncedUsername, pageParam, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.items.length > 0 ? nextPage : undefined;
    },
    enabled: enabled && !!debouncedUsername.trim(),
  });

  // Flatten the pages of users into a single array
  // This is a functional programming technique: using reduce to transform data
  const users = data?.pages.reduce<GitHubUser[]>((acc, page) => {
    return [...acc, ...page.items];
  }, []) || [];

  return {
    users,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
