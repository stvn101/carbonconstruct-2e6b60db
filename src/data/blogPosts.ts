
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

export const blogPosts: BlogPost[] = [
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

