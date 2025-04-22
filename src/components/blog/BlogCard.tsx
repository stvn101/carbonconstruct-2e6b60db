
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/data/blogPosts";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // If the post has an external URL, link directly to it; otherwise, use existing logic (internal link)
  const isExternal = !!post.url;

  // Fallback for legacy/internal post URL logic, keep in for future extensibility
  let postUrl: string;
  if (isExternal) {
    postUrl = post.url;
  } else {
    const formattedTitle = post.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-');   // Replace spaces with dashes
    postUrl = `/blog/posts/${post.id}-${formattedTitle}`;
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-carbon-500 text-white text-xs py-1 px-2 rounded">
          {post.category}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            {post.date}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
        </div>
        <CardTitle className="mt-2 hover:text-carbon-500 transition-colors">
          <a
            href={postUrl}
            className="hover:underline"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {post.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/70">{post.excerpt}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button variant="ghost" className="group text-carbon-500 hover:text-carbon-600" asChild>
          <a
            href={postUrl}
            className="flex items-center"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            Read More 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default BlogCard;

