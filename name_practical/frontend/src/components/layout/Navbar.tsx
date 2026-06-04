import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = user ? (user.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin' }
  ] : [
    { name: 'Dashboard', path: '/customer/dashboard' },
    { name: 'Book a Car', path: '/customer/book' }
  ]) : [
    { name: 'Login', path: '/login' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? 'bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3' : 'bg-transparent py-5'}`}>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-ink text-white p-1.5 rounded-lg group-hover:bg-ink/90 transition-colors">
              <Car size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">
              CarRental
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) =>
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                
                  {link.name}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              {user ?
              <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-ink flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-canvas border border-border flex items-center justify-center">
                      <User size={16} className="text-ink-muted" />
                    </div>
                    {user.username}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </div> :

              <>
                  <Link to="/login">
                    <Button size="sm">Log in</Button>
                  </Link>
                </>
              }
            </div>
          </div>

          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen &&
      <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) =>
        <Link
          key={link.name}
          to={link.path}
          className="text-base font-medium text-ink py-2 border-b border-border"
          onClick={() => setIsMobileMenuOpen(false)}>
          
              {link.name}
            </Link>
        )}
          <div className="pt-2 flex flex-col gap-3">
            {user ?
          <>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center">
                    <User size={20} className="text-ink-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {user.username}
                    </p>
                    <p className="text-xs text-ink-muted capitalize">{user.role}</p>
                  </div>
                </div>
                <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}>
              
                  Log out
                </Button>
              </> :

              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Log in</Button>
                </Link>
              </>
          }
          </div>
        </div>
      }
    </nav>);
}
