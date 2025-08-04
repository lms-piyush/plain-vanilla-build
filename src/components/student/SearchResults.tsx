import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'class' | 'tutor';
  tutorName?: string;
  tutorId?: string;
  subject?: string;
  rating?: number;
  totalReviews?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
}

const SearchResults = ({ results, isLoading, error, query }: SearchResultsProps) => {
  const navigate = useNavigate();

  if (!query.trim()) return null;

  if (isLoading) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">No results found for "{query}"</p>
      </div>
    );
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'class') {
      navigate(`/student/classes/${result.id}`);
    } else {
      navigate(`/student/tutor/${result.id}`);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Search Results ({results.length})
      </p>
      
      {results.map((result) => (
        <Card 
          key={result.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleResultClick(result)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {result.type === 'class' ? (
                  <BookOpen className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {result.type === 'class' ? 'Class' : 'Tutor'}
                  </Badge>
                </div>
                
                {result.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {result.description}
                  </p>
                )}
                
                {result.type === 'class' && (
                  <div className="flex items-center space-x-2 mt-1">
                    {result.subject && (
                      <Badge variant="outline" className="text-xs">
                        {result.subject}
                      </Badge>
                    )}
                    {result.tutorName && (
                      <span className="text-xs text-gray-500">
                        by {result.tutorName}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;