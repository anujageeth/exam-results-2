import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  GraduationCap,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Check Results',
    description: 'View your latest exam results as soon as they are published by the administration.',
    link: '/student/dashboard',
  },
  {
    icon: FileText,
    title: 'Full Transcript',
    description: 'Access your complete academic transcript with detailed module-wise grade records.',
    link: '/student/transcript',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Portal',
    description: 'Administrative tools for result management, student records, and exam sessions.',
    link: '/admin/dashboard',
  },
];

const stats = [
  { icon: Users, value: '2,400+', label: 'Active Students' },
  { icon: BookOpen, value: '120+', label: 'Modules Offered' },
  { icon: Award, value: '87%', label: 'Pass Rate' },
  { icon: BarChart3, value: '42', label: 'Exams Conducted' },
];

const Home = () => {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ceylon-maroon">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-ceylon-maroon via-ceylon-maroon-700 to-ceylon-maroon-900" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-ceylon-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-ceylon-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #F5BA1D 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* University crest */}
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-ceylon-gold/15 mb-8 animate-fade-in">
              <GraduationCap className="h-12 w-12 text-ceylon-gold" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in font-serif">
              Ceylon University
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
              <div className="h-px w-12 bg-ceylon-gold/40" />
              <p className="text-ceylon-gold font-medium tracking-widest uppercase text-sm">
                Examination Results Portal
              </p>
              <div className="h-px w-12 bg-ceylon-gold/40" />
            </div>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
              Access your examination results, academic transcripts, and track your academic progress 
              - all in one secure, unified platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link to="/login">
                <Button variant="gold" size="lg" className="gap-2 text-base">
                  Sign In to Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {/* <Link to="/student/dashboard">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 text-base">
                  Student Demo
                </Button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center group animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-ceylon-maroon-50 mb-3 group-hover:bg-ceylon-maroon group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-ceylon-maroon group-hover:text-ceylon-gold transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              A complete examination management ecosystem for students and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <Card 
                    className="h-full group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <CardContent className="p-8">
                      <div className="p-3 rounded-xl bg-ceylon-maroon-50 w-fit mb-5 group-hover:bg-ceylon-maroon transition-colors duration-300">
                        <Icon className="h-6 w-6 text-ceylon-maroon group-hover:text-ceylon-gold transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-ceylon-maroon transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-ceylon-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-ceylon-maroon to-ceylon-maroon-800 rounded-2xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ceylon-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Check Your Results?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Sign in with your university credentials to access your examination results, 
                GPA tracker, and complete academic transcript.
              </p>
              <Link to="/login">
                <Button variant="gold" size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
