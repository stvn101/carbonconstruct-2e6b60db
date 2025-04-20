
import React from 'react';
import { Route } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';

// Use the lazyLoad utility for consistent code splitting
const Pricing = lazyLoad(() => import('@/pages/Pricing'));
const About = lazyLoad(() => import('@/pages/About'));
const Blog = lazyLoad(() => import('@/pages/Blog'));
const BlogPost = lazyLoad(() => import('@/pages/BlogPost'));
const Contact = lazyLoad(() => import('@/pages/Contact'));
const Help = lazyLoad(() => import('@/pages/Help'));
const TermsOfService = lazyLoad(() => import('@/pages/TermsOfService'));
const ConstructionCompanies = lazyLoad(() => import('@/pages/ConstructionCompanies'));
const SustainableBuilding = lazyLoad(() => import('@/pages/SustainableBuilding'));
const Resources = lazyLoad(() => import('@/pages/Resources'));
const Demo = lazyLoad(() => import('@/pages/Demo'));
const Partners = lazyLoad(() => import('@/pages/Partners'));
const PrivacyPolicy = lazyLoad(() => import('@/pages/PrivacyPolicy'));
const CookiePolicy = lazyLoad(() => import('@/pages/CookiePolicy'));
const DataProcessing = lazyLoad(() => import('@/pages/DataProcessing'));

export const marketingRoutes = (
  <>
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/posts/:slug" element={<BlogPost />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/help" element={<Help />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/construction-companies" element={<ConstructionCompanies />} />
    <Route path="/sustainable-building" element={<SustainableBuilding />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/demo" element={<Demo />} />
    <Route path="/partners" element={<Partners />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/cookie-policy" element={<CookiePolicy />} />
    <Route path="/data-processing" element={<DataProcessing />} />
  </>
);
