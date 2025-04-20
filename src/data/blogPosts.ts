
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  url: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building and Construction Industry Sustainability Goals 2050",
    excerpt:
      "This article outlines the long-term sustainability vision for the industry, focusing on ESG frameworks, industry-wide 2050 goals, and collaborative approaches to future-proofing Australia’s built environment.",
    date: "March 18, 2024",
    author: "Master Builders Australia",
    category: "Sustainability",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    url: "https://masterbuilders.com.au/building-and-construction-industry-sustainability-goals-2050/",
  },
  {
    id: 2,
    title:
      "Call for Action: Seizing the Decarbonization Opportunity in Construction",
    excerpt:
      "A global perspective on addressing construction GHG emissions, the role of ESG in capital markets, and strategic pathways to decarbonize the industry.",
    date: "February 7, 2024",
    author: "McKinsey & Company",
    category: "Decarbonization",
    imageUrl:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    url: "https://www.mckinsey.com/industries/engineering-construction-and-building-materials/our-insights/call-for-action-seizing-the-decarbonization-opportunity-in-construction",
  },
  {
    id: 3,
    title:
      "The Vexed Question for Construction Companies: How to Govern During the Crisis for Housing Demand Without Compromising Net Zero Objectives",
    excerpt:
      "Explores the role of governance professionals in aligning housing supply with net zero emissions goals, supply chain optimization, and risk management in the transition to sustainable construction.",
    date: "January 26, 2024",
    author: "Governance Institute of Australia",
    category: "Governance",
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    url: "https://www.governanceinstitute.com.au/news_media/the-vexed-question-for-construction-companies-how-to-govern-during-the-crisis-for-housing-demand-without-compromising-net-zero-objectives/",
  },
  {
    id: 4,
    title: "Master Builders Releases Sustainability Report",
    excerpt:
      "A summary of Master Builders Australia’s first annual report on progress toward its 2050 sustainability goals, including actions on net zero, building resilience, and workforce diversity.",
    date: "December 10, 2023",
    author: "Sustainability Matters",
    category: "Reports",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    url: "https://www.sustainabilitymatters.net.au/content/sustainability/news/master-builders-releases-sustainability-report-551417722",
  },
  {
    id: 5,
    title: "Building a More Sustainable Future",
    excerpt:
      "Discusses legal and ethical imperatives for the construction sector to innovate for sustainability, the global transition to net zero, and the need for holistic change in industry practices.",
    date: "October 20, 2023",
    author: "Law Society Journal (LSJ)",
    category: "Ethics & Law",
    imageUrl:
      "https://images.unsplash.com/photo-1526045996358-2e34ca50211e?auto=format&fit=crop&w=600&q=80",
    url: "https://lsj.com.au/articles/building-a-more-sustainable-future/",
  },
  {
    id: 6,
    title:
      "The Construction Industry Is Getting Greener: Why, How, and What’s Changing",
    excerpt:
      "Examines how the industry is shifting toward sustainable practices, focusing on design phase innovations, global emissions impact, and industry leaders’ roles.",
    date: "August 25, 2021",
    author: "Forbes (SAP Insights)",
    category: "Innovation",
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    url: "https://www.forbes.com/sites/sap/2021/08/25/the-construction-industry-is-getting-greener-why-how-and-whats-changing/",
  },
];
