import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import PageLoading from '@/components/ui/page-loading';

const Pricing = React.lazy(() => import('@/pages/Pricing'));
const About = React.lazy(() => import('@/pages/About'));
const Blog = React.lazy(() => import('@/pages/Blog'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Help = React.lazy(() => import('@/pages/Help'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const ConstructionCompanies = React.lazy(() => import('@/pages/ConstructionCompanies'));
const SustainableBuilding = React.lazy(() => import('@/pages/SustainableBuilding'));
const Resources = React.lazy(() => import('@/pages/Resources'));
const Demo = React.lazy(() => import('@/pages/Demo'));
const Partners = React.lazy(() => import('@/pages/Partners'));

export const marketingRoutes = (
  <>
    <Route path="/pricing" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Pricing />
      </Suspense>
    } />
    <Route path="/about" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <About />
      </Suspense>
    } />
    <Route path="/blog" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Blog />
      </Suspense>
    } />
    <Route path="/blog/posts/:slug" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <BlogPost />
      </Suspense>
    } />
    <Route path="/contact" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Contact />
      </Suspense>
    } />
    <Route path="/help" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Help />
      </Suspense>
    } />
    <Route path="/terms-of-service" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <TermsOfService />
      </Suspense>
    } />
    <Route path="/construction-companies" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <ConstructionCompanies />
      </Suspense>
    } />
    <Route path="/sustainable-building" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <SustainableBuilding />
      </Suspense>
    } />
    <Route path="/resources" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Resources />
      </Suspense>
    } />
    <Route path="/demo" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Demo />
      </Suspense>
    } />
    <Route path="/partners" element={
      <Suspense fallback={<PageLoading isLoading={true} />}>
        <Partners />
      </Suspense>
    } />
  </>
);
