import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, CalendarDays, User } from "lucide-react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Blog post data
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Reduce Embodied Carbon in Your Next Project",
      excerpt: "Learn actionable strategies to minimize the carbon footprint of materials in your construction projects.",
      date: "May 15, 2023",
      author: "Sarah Johnson",
      category: "Sustainability",
      imageUrl: "https://images.unsplash.com/photo-1531058710023-7a65a3b175a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "How the EU's CSRD Will Transform Construction Reporting",
      excerpt: "A comprehensive guide to the Corporate Sustainability Reporting Directive and its implications for builders.",
      date: "April 22, 2023",
      author: "Michael Chen",
      category: "Regulations",
      imageUrl: "https://images.unsplash.com/photo-1529307474719-3d0a417aaf8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Case Study: How Westfield Reduced Carbon by 30% on High-Rise Project",
      excerpt: "An in-depth look at how one of our clients achieved significant carbon reductions while maintaining project timelines.",
      date: "March 10, 2023",
      author: "Jessica Rivera",
      category: "Case Studies",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "The Future of Green Building Materials: 2023 Trends",
      excerpt: "Explore innovative sustainable materials that are changing how we approach construction projects.",
      date: "February 5, 2023",
      author: "David Patel",
      category: "Innovation",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Digital Twins: The Key to Optimizing Building Performance",
      excerpt: "Discover how digital twin technology can help monitor and reduce operational carbon emissions throughout a building's lifecycle.",
      date: "January 18, 2023",
      author: "Alex Thompson",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Why Carbon Benchmarking Matters for Construction Firms",
      excerpt: "Learn how establishing carbon baselines can drive continuous improvement in your sustainability efforts.",
      date: "December 7, 2022",
      author: "Emma Wilson",
      category: "Best Practices",
      imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    }
  ];

  // Filter blog posts based on search query
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-heading">CarbonConstruct Blog</h1>
            <p className="text-lg text-foreground/80 mb-10">
              Insights, guides, and industry trends to help you build more sustainably.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
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
                      <a href={`/blog/posts/${post.id}-${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
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
                        href={`/blog/posts/${post.id}-${post.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center"
                      >
                        Read More 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/70">No blog posts found matching "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}

          {filteredPosts.length > 0 && filteredPosts.length < blogPosts.length && (
            <div className="text-center mt-8">
              <p className="text-foreground/70 mb-4">
                Showing {filteredPosts.length} of {blogPosts.length} posts
              </p>
              <Button 
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Show All Posts
              </Button>
            </div>
          )}

          {searchQuery === "" && (
            <div className="text-center mt-12">
              <Button>Load More Articles</Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
