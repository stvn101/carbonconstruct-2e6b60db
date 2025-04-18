
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blogPosts";

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => {
          const formattedTitle = post.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          const postUrl = `/blog/posts/${post.id}-${formattedTitle}`;
          
          return (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2 text-md hover:text-carbon-500 transition-colors">
                  <Link to={postUrl} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{post.category}</span>
                  <Link to={postUrl} className="text-carbon-500 hover:text-carbon-600 flex items-center text-sm">
                    Read <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.section>
  );
};

export default RelatedPosts;
