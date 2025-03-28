import { Calculator, Database, FileText, GraduationCap, Leaf, LineChart, BarChart3, FileCheck2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 md:py-20 bg-gradient-to-b from-background to-carbon-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Construction Made Simple</h2>
          <p className="text-lg text-muted-foreground">
            Our platform provides everything you need to measure, track, and reduce the carbon footprint of your construction projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1: Carbon Calculator */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <Calculator className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Carbon Footprint Calculator</CardTitle>
              <CardDescription>
                Accurate emissions tracking for your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Calculate the carbon emissions of your construction projects with our precise calculator that accounts for materials, transportation, and energy use.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Material-specific emissions data</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Transportation distance calculations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Energy consumption analysis</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2: Material Database */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <Database className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Material Database</CardTitle>
              <CardDescription>
                Comprehensive carbon coefficients for materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access our extensive database of construction materials with accurate carbon coefficients to make informed sustainable choices.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Thousands of materials cataloged</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Region-specific carbon data</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Alternative material suggestions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3: Reporting */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <FileText className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Project Reporting</CardTitle>
              <CardDescription>
                Clear insights into your environmental impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive reports with carbon scores and compliance status to track your sustainability progress.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Sustainability score metrics</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Regulatory compliance tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Exportable PDF reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 4: Easy Integration */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <FileCheck2 className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Works with your existing workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seamlessly integrate with your existing construction management tools and processes without disruption.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Simple data import/export</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Works alongside existing software</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">No workflow disruption</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 5: Benchmarking */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <BarChart3 className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Benchmarking</CardTitle>
              <CardDescription>
                Compare your performance against industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See how your projects stack up against industry benchmarks and identify areas for improvement.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Industry-wide comparisons</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Project-to-project analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Improvement recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 6: Educational Resources */}
          <Card className="border-carbon-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100">
                <GraduationCap className="h-5 w-5 text-carbon-700" />
              </div>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>
                Learn about sustainable construction practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access our library of educational resources to help your team understand and implement sustainable construction practices.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Video tutorials and guides</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Best practice documentation</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Leaf className="h-4 w-4 text-carbon-500" />
                  </div>
                  <span className="text-sm">Regular sustainability updates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
