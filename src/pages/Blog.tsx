
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogList from "@/components/blog/BlogList";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter blog posts based on search query
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">  {/* Reduced from pt-24 to pt-16 */}
        <section className="py-16 container mx-auto px-4">
          <BlogHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <BlogList 
            posts={filteredPosts}
            searchQuery={searchQuery}
            totalPosts={blogPosts.length}
            onClearSearch={() => setSearchQuery("")}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
