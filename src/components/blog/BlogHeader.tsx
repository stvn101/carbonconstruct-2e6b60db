
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
      className="text-center max-w-3xl mx-auto mb-20"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-heading">
        CarbonConstruct Blog
      </h1>
      <p className="text-lg text-foreground/80 mb-10">
        Insights, guides, and industry trends to help you build more sustainably.
      </p>
      <SearchBar value={searchQuery} onChange={onSearchChange} />
    </motion.div>
  );
};

export default BlogHeader;
