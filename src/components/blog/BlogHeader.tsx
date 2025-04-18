
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
      className="text-center max-w-4xl mx-auto mb-10 pt-16 px-4" 
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-heading tracking-tight leading-[1.4] break-words font-sans antialiased selection:text-carbon-950">
        CarbonConstruct Blog
      </h1>
      <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
        Insights, guides, and industry trends to help you build more sustainably.
      </p>
      <SearchBar value={searchQuery} onChange={onSearchChange} />
    </motion.div>
  );
};

export default BlogHeader;
