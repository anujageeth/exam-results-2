import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-ceylon-gold/20">
                <GraduationCap className="h-6 w-6 text-ceylon-gold" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Ceylon University</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Exam Results Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Empowering academic excellence through transparent and accessible examination result management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-ceylon-gold transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-ceylon-gold transition-colors">Sign In</Link></li>
              <li><Link to="/student/dashboard" className="text-sm text-gray-400 hover:text-ceylon-gold transition-colors">Student Portal</Link></li>
              <li><Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-ceylon-gold transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                Colombo 07, Sri Lanka
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                +94 11 234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                exams@ceylon.ac.lk
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Ceylon University. All rights reserved.
            </p>
            {/* <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Terms of Use</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
