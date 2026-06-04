import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { ShieldCheck, Clock, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.1] mb-6">
              Drive Your Dream<br />
              <span className="text-ink-muted">Rent with Ease</span>
            </h1>
            <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Book the perfect car for your journey. From economy to luxury, 
              we offer a wide range of vehicles at competitive prices.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                user.role === 'admin' ? (
                  <Link to="/admin"><Button size="lg">Go to Dashboard <ArrowRight size={20} className="ml-2" /></Button></Link>
                ) : (
                  <Link to="/customer/dashboard"><Button size="lg">My Dashboard <ArrowRight size={20} className="ml-2" /></Button></Link>
                )
              ) : (
                <>
                  <Link to="/login"><Button size="lg">Get Started <ArrowRight size={20} className="ml-2" /></Button></Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: 'Safe & Reliable', desc: 'All vehicles undergo regular maintenance and safety checks.' },
                { icon: Clock, title: 'Flexible Booking', desc: 'Reserve anytime with easy cancellation and modification.' },
                { icon: Star, title: 'Premium Fleet', desc: 'Choose from a wide selection of top-brand vehicles.' }
              ].map((item, i) => (
                <Card key={i} hoverable>
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-xl bg-canvas border border-border flex items-center justify-center mx-auto mb-5">
                      <item.icon size={28} className="text-ink" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
