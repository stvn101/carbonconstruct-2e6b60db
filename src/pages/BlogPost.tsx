import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";
import type { BlogPost as BlogPostType } from "@/data/blogPosts";
import BlogBreadcrumbs from "@/components/blog/BlogBreadcrumbs";
import RelatedPosts from "@/components/blog/RelatedPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  
  useEffect(() => {
    if (slug) {
      // Extract post ID from the beginning of the slug
      const idMatch = slug.match(/^(\d+)/);
      const postId = idMatch ? Number(idMatch[1]) : null;
      
      if (postId) {
        const foundPost = blogPosts.find(p => p.id === postId);
        setPost(foundPost || null);
        
        // Find related posts based on category
        if (foundPost) {
          const related = blogPosts
            .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3); // Limit to 3 related posts
          setRelatedPosts(related);
        }
      } else {
        setPost(null);
      }
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-2xl font-bold">Blog post not found</h1>
            <Button variant="ghost" asChild className="mt-4">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={post.title}
        description={post.excerpt}
        type="article"
        image={post.imageUrl}
        author={post.author}
      />
      <Navbar />
      <main className="flex-1 pt-24">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="mr-auto">
              <Link to="/blog" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
          
          <BlogBreadcrumbs title={post.title} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
                <span className="text-carbon-500">{post.category}</span>
              </div>
            </div>

            <Card className="overflow-hidden mb-8">
              <div className="aspect-video relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed mb-6">{post.excerpt}</p>
                  <p className="text-muted-foreground">
                    This is a placeholder for the full blog post content. In a real application, 
                    this would contain the complete article text, possibly fetched from a CMS or 
                    database. The excerpt above gives you a preview of what this article covers.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
