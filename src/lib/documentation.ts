
/**
 * This file contains JSDoc documentation for key components and utilities.
 * These documented components can be used as reference for maintaining the codebase.
 */

/**
 * @name CarbonCalculations
 * @description Core calculation logic for carbon emissions in construction projects.
 * 
 * @example
 * import { calculateTotalEmissions } from "@/lib/carbonCalculations";
 * 
 * // Create calculation input
 * const input = {
 *   materials: [{ type: "concrete", quantity: 1000 }],
 *   transport: [{ type: "truck", distance: 100, weight: 1000 }],
 *   energy: [{ type: "electricity", amount: 500 }]
 * };
 * 
 * // Calculate emissions
 * const result = calculateTotalEmissions(input);
 * 
 * @typedef {Object} MaterialInput
 * @property {string} type - Type of material (e.g., "concrete", "steel")
 * @property {number} quantity - Quantity of material in kg
 * 
 * @typedef {Object} TransportInput
 * @property {string} type - Type of transport (e.g., "truck", "train")
 * @property {number} distance - Distance in km
 * @property {number} weight - Weight in kg
 * 
 * @typedef {Object} EnergyInput
 * @property {string} type - Type of energy (e.g., "electricity", "diesel")
 * @property {number} amount - Amount in appropriate units (kWh for electricity, liters for diesel)
 * 
 * @typedef {Object} CalculationResult
 * @property {number} materialEmissions - Total emissions from materials in kg CO2e
 * @property {number} transportEmissions - Total emissions from transport in kg CO2e
 * @property {number} energyEmissions - Total emissions from energy in kg CO2e
 * @property {number} totalEmissions - Sum of all emissions in kg CO2e
 * @property {Object} breakdownByMaterial - Emissions broken down by material type
 * @property {Object} breakdownByTransport - Emissions broken down by transport type
 * @property {Object} breakdownByEnergy - Emissions broken down by energy type
 */

/**
 * @name SEO
 * @description Component for managing meta tags and SEO optimization.
 * 
 * @example
 * import SEO from "@/components/SEO";
 * 
 * <SEO
 *   title="Page Title" 
 *   description="Page description for search engines"
 *   canonical="/page-path"
 * />
 * 
 * @param {Object} props
 * @param {string} [props.title] - Page title (will be appended with site name)
 * @param {string} [props.description] - Meta description
 * @param {string} [props.canonical] - Canonical URL path (without domain)
 * @param {string} [props.image] - Open Graph image URL
 * @param {string} [props.type] - Open Graph type (website, article, etc)
 * @param {string} [props.keywords] - Meta keywords
 * @param {boolean} [props.noIndex] - Whether search engines should index this page
 */

/**
 * @name useScrollTo
 * @description Hook for smooth scrolling to page sections.
 * 
 * @example
 * import { useScrollTo } from "@/hooks/useScrollTo";
 * 
 * const ScrollButton = () => {
 *   const scrollTo = useScrollTo();
 *   
 *   return (
 *     <button onClick={() => scrollTo('section-id')}>
 *       Scroll to Section
 *     </button>
 *   );
 * };
 * 
 * @returns {Function} scrollTo - Function that accepts an element ID and scrolls to it
 */

/**
 * @name ErrorBoundary
 * @description Component for catching and displaying errors gracefully.
 * 
 * @example
 * import ErrorBoundary from "@/components/ErrorBoundary";
 * 
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to be wrapped
 * @param {React.ReactNode} [props.fallback] - Optional custom fallback UI
 */

/**
 * @name useFormValidation
 * @description Hook for form validation with customizable rules.
 * 
 * @example
 * import useFormValidation from "@/hooks/useFormValidation";
 * 
 * const ContactForm = () => {
 *   const { 
 *     values, 
 *     errors, 
 *     handleChange, 
 *     handleBlur, 
 *     validateAll 
 *   } = useFormValidation(
 *     { name: "", email: "" },
 *     { 
 *       name: { required: true },
 *       email: { required: true, isEmail: true }
 *     }
 *   );
 *   
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (validateAll()) {
 *       // Submit form data
 *     }
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="name"
 *         value={values.name}
 *         onChange={handleChange}
 *         onBlur={handleBlur}
 *       />
 *       {errors.name && <p>{errors.name}</p>}
 *       
 *       <input
 *         name="email"
 *         value={values.email}
 *         onChange={handleChange}
 *         onBlur={handleBlur}
 *       />
 *       {errors.email && <p>{errors.email}</p>}
 *       
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * };
 */

/**
 * @name useIsMobile
 * @description Hook for detecting mobile screen size for responsive design.
 * 
 * @example
 * import { useIsMobile } from "@/hooks/use-mobile";
 * 
 * const ResponsiveComponent = () => {
 *   const { isMobile } = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileView />
 *       ) : (
 *         <DesktopView />
 *       )}
 *     </div>
 *   );
 * };
 */

/**
 * @name ThemeProvider
 * @description Provider for managing light/dark theme.
 * 
 * @example
 * import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
 * 
 * // In your app root
 * <ThemeProvider defaultTheme="light">
 *   <App />
 * </ThemeProvider>
 * 
 * // In any component
 * const ThemeSwitcher = () => {
 *   const { theme, setTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *       Toggle Theme
 *     </button>
 *   );
 * };
 */

/**
 * @name PageLoading
 * @description Component for displaying loading state during page transitions or data fetching.
 * 
 * @example
 * import { useState, useEffect } from "react";
 * import PageLoading from "@/components/ui/page-loading";
 * 
 * const DataFetchingComponent = () => {
 *   const [isLoading, setIsLoading] = useState(true);
 *   const [data, setData] = useState(null);
 *   
 *   useEffect(() => {
 *     fetchData().then(result => {
 *       setData(result);
 *       setIsLoading(false);
 *     });
 *   }, []);
 *   
 *   return (
 *     <>
 *       <PageLoading isLoading={isLoading} text="Loading data..." />
 *       {!isLoading && <DisplayData data={data} />}
 *     </>
 *   );
 * };
 */

/**
 * @name GrokIntegration
 * @description Documentation for Grok AI Assistant integration within CarbonConstruct.
 * 
 * @overview
 * The Grok AI integration provides intelligent assistance for construction sustainability
 * through natural language interaction, compliance analysis, and material recommendations.
 * It operates in both online and offline modes with robust error handling.
 * 
 * @components
 * - GrokChat: Main chat interface component
 * - GrokChatContainer: Container that manages chat display and input
 * - GrokComplianceInsights: AI-powered compliance analysis
 * 
 * @hooks
 * - useGrok: Central hook for Grok AI functionality
 * - useGrokUsage: Tracks Grok usage for quota management
 * - useSimpleOfflineMode: Manages offline state detection
 * 
 * @errorHandling
 * The integration includes comprehensive error handling with:
 * - Network error detection and recovery
 * - Rate limit management
 * - Timeout handling with automatic retries
 * - Graceful degradation in offline mode
 * 
 * @example
 * // Using the GrokChat component
 * import GrokChat from "@/components/grok/GrokChat";
 * 
 * const MyComponent = () => {
 *   return (
 *     <GrokProvider>
 *       <GrokChat
 *         placeholder="Ask about sustainability..."
 *         title="Construction Assistant"
 *       />
 *     </GrokProvider>
 *   );
 * };
 * 
 * @offlineSupport
 * The Grok integration supports offline mode with:
 * - Clear UI indicators for offline state
 * - Cached data access where possible
 * - Automatic reconnection attempts
 * - Session persistence across connectivity changes
 */

/**
 * @name useSimpleOfflineMode
 * @description Hook for detecting and managing offline status with network recovery.
 * 
 * @example
 * import { useSimpleOfflineMode } from "@/hooks/useSimpleOfflineMode";
 * 
 * const OfflineAwareComponent = () => {
 *   const { isOffline, checkConnection } = useSimpleOfflineMode();
 *   
 *   return (
 *     <div>
 *       {isOffline ? (
 *         <div>
 *           <p>You are currently offline</p>
 *           <button onClick={checkConnection}>
 *             Check Connection
 *           </button>
 *         </div>
 *       ) : (
 *         <OnlineContent />
 *       )}
 *     </div>
 *   );
 * };
 * 
 * @returns {Object} Object containing:
 * - isOffline: Boolean indicating if the app is offline
 * - checkConnection: Function to manually check connection status
 * - setOfflineStatus: Function to manually set offline status
 */

/**
 * @name NetworkErrorHandling
 * @description Documentation for the network error handling system in CarbonConstruct.
 * 
 * @overview
 * The application includes a comprehensive system for handling network errors
 * across all API interactions, with special focus on Grok AI communication.
 * 
 * @components
 * - isNetworkError: Detects if an error is network-related
 * - withNetworkErrorHandling: HOF for wrapping promises with error handling
 * - withGrokErrorHandling: Specialized for Grok API error handling
 * 
 * @retryMechanisms
 * - Automatic retry with exponential backoff
 * - Connection recovery attempts
 * - Graceful degradation to offline mode
 * 
 * @userFeedback
 * - Toast notifications for connection status
 * - In-UI indicators for offline state
 * - Clear error messages with recovery options
 * 
 * @example
 * // Using network error handling
 * import { withNetworkErrorHandling } from "@/utils/errorHandling";
 * 
 * const fetchWithErrorHandling = async () => {
 *   try {
 *     const data = await withNetworkErrorHandling(
 *       fetch('https://api.example.com/data'),
 *       5000, // timeout in ms
 *       2     // max retries
 *     );
 *     return data;
 *   } catch (error) {
 *     // Handle unrecoverable errors
 *     console.error("Failed after retries:", error);
 *   }
 * };
 */

