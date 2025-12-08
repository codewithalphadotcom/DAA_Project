/**
 * Custom hook for parsing file content
 * Handles file parsing with error handling
 */

import { useMemo } from 'react';
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
  const result = useMemo(() => {
    const content = fileContent.trim();
    if (!content) {
      return {
        data: null,
        error: null,
        isValid: false,
      };
    }

    const parseResult = parserFn(content);
    
    if (parseResult.success && parseResult.data) {
      return {
        data: parseResult.data,
        error: null,
        isValid: true,
      };
    } else {
      return {
        data: null,
        error: parseResult.error || 'Failed to parse file',
        isValid: false,
      };
    }
  }, [fileContent, parserFn]);

  return result;
}
