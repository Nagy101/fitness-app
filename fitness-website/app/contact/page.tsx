import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeroText } from "@/components/shared/page-hero";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Static data extracted to prevent re-creation on render
const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Our Gym",
    details: ["123 Fitness Street", "Health City, HC 12345", "United States"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["Main: +1 (555) 123-4567", "Support: +1 (555) 123-4568"],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@fitpro.com", "support@fitpro.com"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    details: ["Mon-Fri: 5:00 AM - 11:00 PM", "Sat-Sun: 6:00 AM - 10:00 PM"],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const QUICK_ACTIONS = [
  {
    icon: Calendar,
    title: "Book Consultation",
    description: "Schedule a free fitness consultation",
    action: "Book Now",
    available: true,
  },
  {
    icon: Users,
    title: "Join Group Class",
    description: "Find and join our group fitness classes",
    action: "View Classes",
    available: true,
  },
];

const FAQS = [
  {
    question: "What are your membership options?",
    answer:
      "We offer Starter ($49/month), Pro ($89/month), and Elite ($149/month) memberships with different benefits.",
  },
  {
    question: "Do you offer personal training?",
    answer:
      "Yes, we have certified personal trainers available for one-on-one sessions starting at $80 per session.",
  },
  {
    question: "Can I try before I buy?",
    answer:
      "We offer a free 7-day trial for new members to experience our facilities and services.",
  },
  {
    question: "What safety measures do you have?",
    answer:
      "We maintain high cleanliness standards, have 24/7 security monitoring, and certified staff on-site during all hours.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_48%,#f4fbf5_100%)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-[-8%] top-8 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <PageHeroText
              badge="Get In Touch"
              title="Contact"
              highlight="Us"
              description="Need help getting started or choosing the right plan? Reach out through the channel that feels easiest for you."
              badgeProps={{
                className:
                  "rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-sm hover:bg-white",
              }}
              titleClassName="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-primary to-secondary bg-clip-text text-transparent"
              highlightClassName="text-primary"
              descriptionClassName="text-slate-600"
            />
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Fast response team
              </span>
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Consultation-first approach
              </span>
              <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
                Friendly support channels
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Quick Actions
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Choose your next step
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {QUICK_ACTIONS.map((action, index) => (
              <Card
                key={index}
                className="border border-white/80 bg-white/90 shadow-sm hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all text-center rounded-[1.5rem]"
              >
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${action.available ? "bg-primary/10" : "bg-gray-100"}`}
                  >
                    <action.icon
                      className={`h-8 w-8 ${action.available ? "text-primary" : "text-gray-400"}`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {action.title}
                  </h3>
                  <p className="text-muted mb-4">{action.description}</p>
                  <Button
                    className={
                      action.available
                        ? "rounded-full bg-primary hover:bg-[#0056b3] transition-colors duration-200"
                        : ""
                    }
                    disabled={!action.available}
                  >
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border border-white/80 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-950 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Reach us directly
                  </CardTitle>
                  <CardDescription>
                    We removed the message form so you can contact us through
                    quicker, clearer channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {CONTACT_INFO.map((info, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/80 bg-white/80 p-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${info.bgColor}`}
                        >
                          <info.icon className={`h-6 w-6 ${info.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-slate-900">
                            {info.title}
                          </h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-slate-600 leading-7">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border border-white/80 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-950">
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-slate-900">
                        {faq.question}
                      </h4>
                      <p className="text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                      {index < FAQS.length - 1 && (
                        <hr className="my-4 border-slate-200" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border border-white/80 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-950">
                    Need personal guidance?
                  </CardTitle>
                  <CardDescription>
                    If you prefer, start with a consultation and we will guide
                    you to the best plan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary hover:bg-[#0056b3] text-white transition-colors duration-200"
                  >
                    <Link href="/services">
                      Book Consultation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-slate-200 bg-white hover:bg-slate-50"
                  >
                    <Link href="/courses">Browse Programs</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Response Promise
                  </h3>
                  <p className="text-slate-600 leading-7">
                    Most inquiries are answered within the same day during
                    operating hours. For urgent support, phone is the fastest
                    route.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Find Us
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-muted">
              Visit our state-of-the-art facility in the heart of Health City
            </p>
          </div>

          <Card className="border border-white/80 bg-white/90 shadow-sm overflow-hidden rounded-[1.75rem]">
            <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Interactive Map
                </h3>
                <p className="text-muted">
                  123 Fitness Street, Health City, HC 12345
                </p>
                <Button className="mt-4 rounded-full bg-primary hover:bg-[#0056b3] transition-colors duration-200">
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[linear-gradient(135deg,#0f172a_0%,#12314f_55%,#1d4332_100%)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don't wait any longer. Join our community today and take the first
            step towards a healthier, stronger you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-secondary hover:text-white rounded-full"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/40 hover:bg-white hover:text-slate-900 bg-white/10 rounded-full"
            >
              Schedule Tour
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
