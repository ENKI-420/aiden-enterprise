import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Users, Zap, Shield, Globe, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-[#2E8B57] text-white hover:bg-[#2E8B57]/90">
            Revolutionary Genomic Digital Twin Technology
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-[#4A4A4A] mb-6 leading-tight">
            Create Your <span className="text-[#1E90FF]">Genomic Twin</span>
            <br />
            <span className="text-[#DC143C]">Personalized Medicine Platform</span>
          </h1>
          <p className="text-xl text-[#4A4A4A]/80 mb-8 max-w-3xl mx-auto">
            Unlock personalized health insights with our AI-powered Genomic Twin Builder. Create a digital
            representation of your genetic profile for precision medicine, risk prediction, and personalized treatment
            optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white px-8 py-3">
                Build Your Genomic Twin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/clinical-demo">
              <Button
                variant="outline"
                size="lg"
                className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10 px-8 py-3 bg-transparent"
              >
                View Clinical Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <header className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">
                The Future of Personalized Medicine: How Genomic Digital Twin Technology is Transforming Healthcare
              </h2>
              <p className="text-[#4A4A4A]/70 text-lg">
                Exploring the revolutionary impact of AI-powered genomic twins on precision medicine, drug discovery,
                and personalized treatment optimization.
              </p>
            </header>

            <div className="text-[#4A4A4A] space-y-6">
              <p className="text-lg leading-relaxed">
                In an era where <strong>Precision Medicine</strong> is becoming the gold standard of healthcare, the
                emergence of <strong>Genomic Digital Twin</strong> technology represents a paradigm shift in how we
                approach personalized treatment. The concept of creating an
                <strong>AI-Powered Genomic Twin</strong> that can authentically simulate an individual's genetic
                responses, drug interactions, and disease susceptibilities is no longer theoretical—it's the
                cutting-edge reality that platforms like Genomic Twin are bringing to healthcare providers, researchers,
                and patients worldwide.
              </p>

              <h3 className="text-2xl font-semibold text-[#1E90FF] mt-8 mb-4">
                1. Advanced Genomic Profile Analyzer: Beyond Traditional Genetic Testing
              </h3>

              <p>
                The first transformative aspect of modern <strong>Genomic Twin Builder</strong> technology lies in its
                sophisticated <strong>Genomic Profile Analyzer</strong> capabilities. Unlike traditional
                <strong>Genetic Testing Services</strong> that provide static reports, advanced
                <strong>AI Genomic Analysis</strong> systems process thousands of genetic variants to create a truly
                dynamic health simulation.
              </p>

              <p>
                This <strong>Genetic Risk Predictor</strong> technology goes far beyond surface-level SNP analysis. It
                examines polygenic risk scores, pharmacogenomic interactions, rare variant impacts, and epigenetic
                factors that make each individual's health profile unique. The result is a
                <strong>Personalized Health Simulation</strong> system that can predict disease susceptibility and
                treatment responses with unprecedented accuracy, making it an invaluable
                <strong>Clinical Decision Support</strong> tool for healthcare professionals.
              </p>

              <h3 className="text-2xl font-semibold text-[#1E90FF] mt-8 mb-4">
                2. HIPAA-Compliant Data Integration and Privacy-First Architecture
              </h3>

              <p>
                The second revolutionary feature of modern <strong>Healthcare SaaS Platform</strong> solutions is their
                ability to seamlessly integrate with multiple healthcare data sources while maintaining the highest
                standards of <strong>HIPAA Compliance</strong> and patient privacy protection. Advanced
                <strong>Healthcare Data Integration</strong> technology can analyze genomic data from sequencing
                platforms, electronic health records, and wearable devices to build a comprehensive understanding of the
                patient's health profile.
              </p>

              <p>
                What sets leading platforms apart is their commitment to <strong>Healthcare Data Security</strong>
                practices. Patients maintain complete control over their genetic data, with transparent processing
                methods and the ability to modify or delete their genomic twin at any time. This
                <strong>Genetic Privacy Protection</strong> approach ensures that while the AI learns from patient data,
                privacy and security remain paramount concerns in the platform's architecture.
              </p>

              <h3 className="text-2xl font-semibold text-[#1E90FF] mt-8 mb-4">
                3. Real-time Health Simulations with Continuous Learning
              </h3>

              <p>
                The third game-changing aspect of contemporary <strong>AI Healthcare Platform</strong> solutions is
                their implementation of real-time health simulations and continuous learning systems. The innovative
                <strong>Health Simulation Engine</strong> allows healthcare providers to model treatment outcomes,
                predict drug responses, and assess disease risks in real-time.
              </p>

              <p>
                This <strong>Personalized Medicine AI</strong> functionality transforms the platform from a simple
                genetic analysis tool into a comprehensive <strong>Clinical Decision Support System</strong>. Healthcare
                providers can simulate treatment scenarios, receive <strong>Drug Response Predictions</strong>, and even
                use the genomic twin as a research tool for clinical trials. The
                <strong>Continuous Health Monitoring</strong> capabilities ensure that the genomic twin becomes more
                accurate and helpful as new genetic research emerges and patient data is updated.
              </p>

              <h3 className="text-2xl font-semibold text-[#DC143C] mt-8 mb-4">
                Conclusion: The Dawn of Truly Personalized Healthcare
              </h3>

              <p>
                As we stand at the threshold of a new era in precision medicine, <strong>Genomic Digital Twin</strong>
                technology represents more than just another advancement in healthcare AI—it signifies a fundamental
                shift toward truly personalized medicine. The convergence of sophisticated
                <strong>AI Genomic Analysis</strong>, robust privacy protection, and real-time health simulations
                creates unprecedented opportunities for healthcare providers to deliver precision care tailored to each
                patient's unique genetic profile.
              </p>

              <p>
                The implications extend far beyond individual patient care. As <strong>Healthcare AI SaaS</strong>
                platforms continue to evolve, we're witnessing the emergence of{" "}
                <strong>Population Health Genomics</strong>
                technology that could revolutionize drug discovery, clinical trial design, and public health strategies.
                The question isn't whether <strong>AI-Powered Precision Medicine</strong> will transform healthcare—it's
                how quickly we'll adapt to a world where every treatment decision is informed by comprehensive genomic
                simulations.
              </p>

              <p className="text-lg font-medium text-[#1E90FF] mt-8">
                The future of medicine is not just personalized—it's genomically precise, ethically sound, and
                scientifically revolutionary.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">Powerful Features for Your AI Digital Twin</h2>
            <p className="text-[#4A4A4A]/70 text-lg max-w-2xl mx-auto">
              Everything you need to create, customize, and deploy your personalized AI assistant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-[#1E90FF] mb-4" />
                <CardTitle className="text-[#4A4A4A]">Genomic Profile Analyzer</CardTitle>
                <CardDescription>
                  Advanced AI algorithms analyze your genetic variants, SNPs, and genomic data for comprehensive health
                  insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-[#DC143C] mb-4" />
                <CardTitle className="text-[#4A4A4A]">Real-time Health Simulations</CardTitle>
                <CardDescription>
                  Generate personalized health predictions and treatment response simulations based on your genetic
                  profile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-[#2E8B57] mb-4" />
                <CardTitle className="text-[#4A4A4A]">HIPAA Compliant Security</CardTitle>
                <CardDescription>
                  Your genetic data is protected with healthcare-grade security and full HIPAA compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-[#1E90FF] mb-4" />
                <CardTitle className="text-[#4A4A4A]">Healthcare Integration</CardTitle>
                <CardDescription>
                  Seamlessly integrate with EHRs, genetic testing platforms, and wearable health devices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-[#DC143C] mb-4" />
                <CardTitle className="text-[#4A4A4A]">Clinical Collaboration</CardTitle>
                <CardDescription>
                  Share genomic insights securely with healthcare providers and research teams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-[#2E8B57] mb-4" />
                <CardTitle className="text-[#4A4A4A]">Continuous Research Updates</CardTitle>
                <CardDescription>
                  Your genomic twin evolves with the latest genetic research and clinical findings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E90FF] to-[#DC143C]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Genomic Digital Twin?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join leading healthcare providers and researchers who are already using Genomic Twin to revolutionize
            personalized medicine and precision healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#1E90FF] hover:bg-white/90 px-8 py-3">
                Start Clinical Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                View Healthcare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
