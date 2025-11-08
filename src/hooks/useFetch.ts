import { useEffect, useState, useRef, useCallback } from 'react';
import { mockFetch } from '../utils/api';
import { ErrorResponse } from '../types';

interface UseFetchProps {
  url: string;
  isMock?: boolean;
  pollingInterval?: number;
}

const defaultErrorResponse: Readonly<ErrorResponse> = {
  message: 'Failed to fetch data',
  status: 500,
};

export const useFetch = <ResponseType extends any>({
  url,
  isMock = true,
  pollingInterval = 10000,
}: UseFetchProps) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (isMock) {
        const mockedData = await mockFetch<ResponseType>(url);
        // MockFetch does not return a new referenced data and our useEffect is not triggered, so we need to create a new referenced data
        const newReferencedData = (Array.isArray(mockedData) && [...mockedData]) || mockedData;
        setData(newReferencedData as ResponseType);
      } else {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      }
      setError(null);
    } catch (error) {
      setError((error as ErrorResponse) || defaultErrorResponse);
    } finally {
      setLoading(false);
    }
  }, [url, isMock]);

  useEffect(() => {
    fetchData();

    if (pollingInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, pollingInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, pollingInterval]);

  return { data, error, loading };
};
