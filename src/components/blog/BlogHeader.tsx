
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const BlogHeader = ({ searchQuery, onSearchChange }: BlogHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-10 pt-8" // Reduced mb and added pt-8 to move content up
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-heading tracking-tight leading-tight">
        CarbonConstruct Blog
      </h1>
      <p className="text-lg text-foreground/80 mb-10 px-4">
        Insights, guides, and industry trends to help you build more sustainably.
      </p>
      <SearchBar value={searchQuery} onChange={onSearchChange} />
    </motion.div>
  );
};

export default BlogHeader;
