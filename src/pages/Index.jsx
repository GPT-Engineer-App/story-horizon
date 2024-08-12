import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import algoliasearch from 'algoliasearch/lite';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const client = algoliasearch('UJ5WYC0L7X', '8ece23f8eb07cd25d40262a1764599b1');
const index = client.initIndex('Item_production_ordered');

const fetchStories = async () => {
  const result = await index.search('', {
    hitsPerPage: 50,
    attributesToRetrieve: ['title', 'url', 'author', 'points', 'num_comments', 'created_at'],
    sortBy: ['created_at:desc']
  });
  return result.hits;
};

const Index = () => {
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['hackerNewsStories'],
    queryFn: fetchStories,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hacker News - Latest 50 Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            {stories.map((story, index) => (
              <div key={story.objectID} className="mb-4 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {index + 1}. {story.title}
                  </a>
                </h2>
                <p className="text-sm text-gray-600">
                  {story.points} points by {story.author} | {story.num_comments} comments | {new Date(story.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
