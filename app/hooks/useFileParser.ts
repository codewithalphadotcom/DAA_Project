/**
 * Custom hook for parsing file content
 * Handles file parsing with error handling
 */

import { useState, useEffect } from 'react';
import { ParseResult } from '../utils/fileParser';

export interface UseFileParserResult<T> {
  data: T | null;
  error: string | null;
  isValid: boolean;
}

/**
 * Hook for parsing file content using a parser function
 * @param fileContent - Raw file content string
 * @param parserFn - Function that parses the file content
 */
export function useFileParser<T>(
  fileContent: string,
  parserFn: (content: string) => ParseResult<T>
): UseFileParserResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileContent.trim()) {
      setData(null);
      setError(null);
      return;
    }

    const result = parserFn(fileContent);
    
    if (result.success && result.data) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error || 'Failed to parse file');
    }
  }, [fileContent, parserFn]);

  return {
    data,
    error,
    isValid: data !== null && error === null,
  };
}
