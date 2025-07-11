import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  const plans = [
    {
      name: "Clinical Starter",
      price: "$299",
      period: "/month",
      description: "Perfect for small practices getting started with genomic twins",
      features: [
        "Up to 50 patient genomic profiles",
        "Basic genetic risk analysis",
        "Standard health simulations",
        "HIPAA compliant storage",
        "Email support",
        "EHR integration (basic)",
      ],
      popular: false,
      cta: "Start Clinical Trial",
    },
    {
      name: "Healthcare Professional",
      price: "$799",
      period: "/month",
      description: "Ideal for hospitals and larger healthcare practices",
      features: [
        "Up to 500 patient profiles",
        "Advanced pharmacogenomic analysis",
        "Real-time health simulations",
        "Priority clinical support",
        "Full EHR integration",
        "Drug interaction predictions",
        "Clinical decision support",
        "Research collaboration tools",
      ],
      popular: true,
      cta: "Start Clinical Trial",
    },
    {
      name: "Healthcare Enterprise",
      price: "$2,499",
      period: "/month",
      description: "For health systems and research institutions",
      features: [
        "Unlimited patient profiles",
        "Population genomics analysis",
        "Custom clinical workflows",
        "24/7 dedicated support",
        "Advanced research tools",
        "Multi-site deployment",
        "Custom integrations",
        "Clinical trial support",
        "Regulatory compliance",
        "Data analytics dashboard",
        "SLA guarantee",
      ],
      popular: false,
      cta: "Contact Healthcare Sales",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-[#2E8B57] text-white hover:bg-[#2E8B57]/90">Healthcare AI SaaS Platform</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4A4A4A] mb-6">
            Choose Your <span className="text-[#1E90FF]">Genomic Twin</span> Healthcare Plan
          </h1>
          <p className="text-xl text-[#4A4A4A]/80 mb-8 max-w-2xl mx-auto">
            Start building genomic digital twins for precision medicine today. Choose the plan that fits your healthcare
            practice and unlock the power of AI-driven personalized medicine.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-lg hover:shadow-xl transition-shadow ${
                  plan.popular ? "ring-2 ring-[#4A90E2] scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#4A90E2] text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-[#4A4A4A]">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#4A90E2]">{plan.price}</span>
                    <span className="text-[#4A4A4A]/70">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-[#3EB489] flex-shrink-0" />
                        <span className="text-[#4A4A4A]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.cta === "Contact Healthcare Sales" ? "/contact" : "/register"}>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white"
                          : "bg-white border border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2]/10"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">Healthcare FAQ</h2>
            <p className="text-[#4A4A4A]/70 text-lg">
              Everything you need to know about our Genomic Twin healthcare platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                  How does the Genomic Twin work in clinical practice?
                </h3>
                <p className="text-[#4A4A4A]/70">
                  Our AI analyzes patient genomic data to create personalized health simulations, predict drug
                  responses, and assess disease risks, providing clinical decision support for precision medicine.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                  Is patient genomic data secure and HIPAA compliant?
                </h3>
                <p className="text-[#4A4A4A]/70">
                  Yes, we maintain full HIPAA compliance with enterprise-grade security. All genomic data is encrypted
                  and stored according to healthcare regulations with complete audit trails.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                  Can I integrate with existing EHR systems?
                </h3>
                <p className="text-[#4A4A4A]/70">
                  Yes, our platform integrates with major EHR systems through HL7 FHIR standards, allowing seamless
                  incorporation of genomic insights into existing clinical workflows.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                  What types of genomic data can be analyzed?
                </h3>
                <p className="text-[#4A4A4A]/70">
                  We support whole genome sequencing, exome sequencing, targeted gene panels, and SNP arrays from major
                  sequencing platforms and genetic testing providers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">Do you offer clinical validation studies?</h3>
                <p className="text-[#4A4A4A]/70">
                  Yes! We provide clinical validation studies and can work with your institution to demonstrate efficacy
                  and clinical utility for regulatory and accreditation purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">How accurate are the genomic predictions?</h3>
                <p className="text-[#4A4A4A]/70">
                  Our genomic twins achieve 95%+ accuracy for pharmacogenomic predictions and disease risk assessments,
                  with continuous improvement through machine learning and clinical feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
