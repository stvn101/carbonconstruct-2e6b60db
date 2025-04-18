
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/data/blogPosts";

interface BlogListProps {
  posts: BlogPost[];
  searchQuery: string;
  totalPosts: number;
  onClearSearch: () => void;
}

const BlogList = ({ posts, searchQuery, totalPosts, onClearSearch }: BlogListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/70">No blog posts found matching "{searchQuery}"</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <BlogCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {posts.length < totalPosts && (
        <div className="text-center mt-8">
          <p className="text-foreground/70 mb-4">
            Showing {posts.length} of {totalPosts} posts
          </p>
          <Button 
            variant="outline"
            onClick={onClearSearch}
          >
            Show All Posts
          </Button>
        </div>
      )}
    </>
  );
};

export default BlogList;
