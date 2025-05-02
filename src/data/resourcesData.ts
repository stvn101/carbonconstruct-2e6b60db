
export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  date?: string;
  thumbnail?: string;
  type: 'guide' | 'webinar' | 'research';
  tags?: string[];
}

// Complete resource database with 2024+ data
export const resourcesData: ResourceItem[] = [
  // Guides
  { 
    title: "2024 NCC Compliance Guide", 
    description: "Learn how to meet Australia's National Construction Code 2024 updates for carbon reduction requirements.",
    url: "https://ncc.abcb.gov.au/",
    date: "May 2, 2024",
    type: "guide",
    tags: ["regulation", "compliance", "NCC", "building code"]
  },
  { 
    title: "Carbon Neutral Materials Selection", 
    description: "A comprehensive guide to selecting carbon neutral and net-zero materials for 2024 and beyond.",
    url: "https://www.worldgbc.org/",
    date: "April 18, 2024",
    type: "guide",
    tags: ["materials", "net-zero", "carbon neutral"]
  },
  { 
    title: "Embodied Carbon Calculation Methods", 
    description: "Updated 2024 methodologies for accurately measuring and reducing embodied carbon in construction projects.",
    url: "https://carbonleadershipforum.org/lca-practice-guide/",
    date: "March 12, 2024",
    type: "guide",
    tags: ["embodied carbon", "LCA", "measurement"]
  },
  { 
    title: "Green Star Buildings Rating Tool", 
    description: "Navigate the 2024 Green Star Buildings rating system to achieve higher sustainability scores.",
    url: "https://new.gbca.org.au/green-star/",
    date: "February 22, 2024",
    type: "guide",
    tags: ["certification", "Green Star", "rating"]
  },
  
  // Webinars
  { 
    title: "Managing Material EPDs in 2024", 
    description: "Learn how to interpret and leverage Environmental Product Declarations for your construction projects.",
    url: "https://www.thefifthestate.com.au/",
    date: "May 15, 2024",
    type: "webinar",
    tags: ["EPD", "materials", "documentation"]
  },
  { 
    title: "Digital Carbon Tracking Technologies", 
    description: "Explore the latest digital tools for real-time carbon tracking in construction projects.",
    url: "https://buildingtransparency.org/ec3",
    date: "April 28, 2024",
    type: "webinar",
    tags: ["digital", "tracking", "tools"]
  },
  { 
    title: "NABERS for New Buildings", 
    description: "Understanding the May 2024 updates to NABERS ratings for new construction in Australia.",
    url: "https://www.nabers.gov.au/",
    date: "May 5, 2024",
    type: "webinar",
    tags: ["NABERS", "rating", "certification"]
  },
  { 
    title: "Carbon Neutral Construction Practices", 
    description: "Industry experts discuss practical approaches to achieving carbon neutrality in construction.",
    url: "https://www.climateworkscentre.org/resource/decarbonisation-futures-solutions-actions-and-benchmarks-for-a-net-zero-emissions-australia/",
    date: "March 30, 2024",
    type: "webinar",
    tags: ["carbon neutral", "best practices", "industry"]
  },
  
  // Research
  { 
    title: "Construction Emissions Report 2024", 
    description: "Comprehensive analysis of construction carbon emissions in Australia for the first quarter of 2024.",
    url: "https://www.climateworkscentre.org/",
    date: "April 30, 2024",
    type: "research",
    tags: ["emissions", "statistics", "analysis"]
  },
  { 
    title: "Circular Economy in Construction", 
    description: "Research on implementing circular economy principles in Australian construction projects.",
    url: "https://www.csiro.au/en/research/environmental-impacts/sustainability/circular-economy",
    date: "March 15, 2024",
    type: "research",
    tags: ["circular economy", "waste reduction", "sustainability"]
  },
  { 
    title: "Low-Carbon Concrete Innovations", 
    description: "The latest research on geopolymer and other low-carbon concrete technologies from 2024.",
    url: "https://www.cement.org/",
    date: "February 8, 2024",
    type: "research",
    tags: ["concrete", "innovation", "materials"]
  },
  { 
    title: "Climate Resilient Building Materials", 
    description: "2024 study on materials that can withstand increasing climate challenges while reducing carbon footprint.",
    url: "https://www.wbdg.org/",
    date: "January 25, 2024",
    type: "research",
    tags: ["resilience", "climate change", "materials"]
  }
];
