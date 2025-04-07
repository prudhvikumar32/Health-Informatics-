import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Database, 
  Stethoscope, 
  LineChart, 
  Briefcase, 
  GraduationCap,
  Heart, 
  BarChart4, 
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">
                <Database className="inline-block mr-2 h-6 w-6" />
                Health Informatics Hub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                What is Health Informatics?
              </h1>
              <p className="text-xl text-gray-600">
                Bridging healthcare and technology to improve patient care and decision-making.
              </p>
              <p className="text-gray-700">
                Health Informatics combines healthcare expertise, data science, and information technology 
                to collect, analyze, and utilize health data for better patient outcomes.
              </p>
              <div className="pt-4">
                <Link href="/auth">
                  <Button size="lg" className="mr-4">
                    Explore Job Market
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
                <div className="absolute top-4 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-xl p-8 m-8 grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-center">
                      <Database className="h-12 w-12 text-primary mb-3" />
                      <p className="text-sm font-medium text-center">Data Management</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Stethoscope className="h-12 w-12 text-primary mb-3" />
                      <p className="text-sm font-medium text-center">Clinical Care</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <LineChart className="h-12 w-12 text-primary mb-3" />
                      <p className="text-sm font-medium text-center">Analytics</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart className="h-12 w-12 text-primary mb-3" />
                      <p className="text-sm font-medium text-center">Patient Care</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Health Informatics Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Understanding Health Informatics</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Health Informatics is where healthcare meets technology, creating solutions that improve care quality,
              efficiency, and accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Electronic Health Records</h3>
                <p className="text-gray-600">
                  Digital systems that securely store patient health information, making it accessible to authorized healthcare providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Clinical Decision Support</h3>
                <p className="text-gray-600">
                  Systems that provide healthcare professionals with knowledge and patient-specific information to enhance clinical decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Healthcare Analytics</h3>
                <p className="text-gray-600">
                  Using data analysis to identify patterns, predict outcomes, and optimize healthcare delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why is Health Informatics Important */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Health Informatics Matters</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Health Informatics is transforming healthcare in numerous ways, benefiting patients,
              providers, and healthcare systems alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Improved Patient Care</h3>
                <p className="text-gray-600">
                  Access to complete, accurate patient data helps healthcare providers make better clinical decisions, 
                  reducing medical errors and improving treatment outcomes.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Enhanced Efficiency</h3>
                <p className="text-gray-600">
                  Streamlined workflows and automated processes reduce administrative burden, allowing healthcare 
                  professionals to focus more on patient care.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cost Reduction</h3>
                <p className="text-gray-600">
                  By eliminating redundant tests, improving resource allocation, and preventing readmissions, 
                  health informatics helps control healthcare costs.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Remote Healthcare</h3>
                <p className="text-gray-600">
                  Telemedicine and remote monitoring technologies, especially crucial during the pandemic, 
                  extend healthcare access to underserved populations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Career Paths in Health Informatics</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The field offers diverse career opportunities combining healthcare knowledge and technical skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Health Informatics Specialist</h3>
                <p className="text-gray-600 mb-3">
                  Bridges the gap between IT and healthcare, implementing and managing health information systems.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> Health IT systems, project management, clinical workflow knowledge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Clinical Data Analyst</h3>
                <p className="text-gray-600 mb-3">
                  Analyzes clinical data to improve healthcare delivery, patient outcomes, and operational efficiency.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> SQL, data visualization (Tableau, Power BI), statistical analysis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">EHR Implementation Consultant</h3>
                <p className="text-gray-600 mb-3">
                  Helps healthcare organizations implement and optimize electronic health record systems.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> EHR systems (Epic, Cerner), training, change management
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Healthcare Data Scientist</h3>
                <p className="text-gray-600 mb-3">
                  Applies advanced analytics and machine learning to extract insights from healthcare data.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> Python/R, machine learning, statistical modeling, clinical data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-yellow-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Health Information Manager</h3>
                <p className="text-gray-600 mb-3">
                  Oversees health information systems, ensuring data quality, security, and regulatory compliance.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> Healthcare regulations (HIPAA), data governance, leadership
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Clinical Systems Analyst</h3>
                <p className="text-gray-600 mb-3">
                  Designs and improves clinical information systems to support patient care processes.
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Skills:</span> Systems analysis, clinical workflows, technical documentation
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth">
              <Button size="lg">
                Explore Job Market Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Market Trends Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Job Market Trends</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The demand for health informatics professionals continues to grow rapidly across the United States.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Growth & Demand</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Field Growth Rate</span>
                      <span className="text-sm font-medium text-green-600">14%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Faster than average job growth over the next decade</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Salary</span>
                      <span className="text-sm font-medium text-blue-600">$87,250</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">3.5% year-over-year increase</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Job Satisfaction</span>
                      <span className="text-sm font-medium text-purple-600">High</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ranked among top healthcare technology careers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-24 text-sm">California</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">2,145 jobs</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">Texas</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">1,876 jobs</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">New York</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">1,652 jobs</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">Florida</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">1,435 jobs</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">Massachusetts</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">1,287 jobs</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-center">
                  <Link href="/auth">
                    <span className="text-primary hover:underline cursor-pointer">
                      Explore our interactive job market dashboard →
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How to Get Started</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Pathways to begin your career in health informatics, regardless of your background.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Education Pathways</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Bachelor's in Health Informatics, Information Technology, or Computer Science
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Master's in Health Informatics or Healthcare Management
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Post-graduate certificates for professionals transitioning from healthcare or IT
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    RHIA (Registered Health Information Administrator)
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    CHDA (Certified Health Data Analyst)
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    CAHIMS (Certified Associate in Healthcare Information Management Systems)
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Epic or Cerner Certifications (vendor-specific)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Essential Skills</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Database management (SQL)
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Data analysis and visualization
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Healthcare terminology and workflows
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Electronic health record systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Project management
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Recommended Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Online Learning</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Coursera - Health Informatics Specialization</li>
                  <li>• edX - Healthcare IT Fundamentals</li>
                  <li>• HIMSS Online Learning Center</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Professional Organizations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• HIMSS (Healthcare Information and Management Systems Society)</li>
                  <li>• AMIA (American Medical Informatics Association)</li>
                  <li>• AHIMA (American Health Information Management Association)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Health Informatics Careers?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Dive into our comprehensive job market analysis tools and discover opportunities in this growing field.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Health Informatics Hub</h3>
              <p className="text-sm">
                Your resource for exploring careers and opportunities in the dynamic field of health informatics.
              </p>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth"><span className="hover:text-white cursor-pointer">Job Market Dashboard</span></Link></li>
                <li><Link href="/auth"><span className="hover:text-white cursor-pointer">Salary Explorer</span></Link></li>
                <li><Link href="/auth"><span className="hover:text-white cursor-pointer">Skills Analysis</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white cursor-pointer">Learning Paths</span></li>
                <li><span className="hover:text-white cursor-pointer">Certifications Guide</span></li>
                <li><span className="hover:text-white cursor-pointer">Career Transitions</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact</span></li>
                <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>© 2025 Health Informatics Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* We use global CSS for animations instead - see below */}
    </div>
  );
};

export default LandingPage;