import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-orange-700 via-orange-600 to-orange-400 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* About Us */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">👩‍💻 About Us</h2>
          <p className="text-sm text-orange-100 leading-relaxed">
            We aim to bridge the gap between 💼 recruiters and 👷 workers by providing a seamless platform with modern tools and efficient communication.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🔗 Quick Links</h2>
          <ul className="space-y-2 text-sm text-orange-100">
            <li>👉 <Link to="/" className="hover:text-white hover:underline">Home</Link></li>
            <li>👉 <Link to="/login" className="hover:text-white hover:underline">Login</Link></li>
            <li>👉 <Link to="/signup" className="hover:text-white hover:underline">Sign Up</Link></li>
            <li>👉 <Link to="/contact" className="hover:text-white hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">📲 Connect</h2>
          <p className="text-sm text-orange-100 mb-2">Follow us on social media:</p>
          <div className="flex gap-4 text-2xl text-orange-100">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <FaGithub /> {/* 🐱 GitHub */}
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <FaLinkedin /> {/* 💼 LinkedIn */}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <FaInstagram /> {/* 📸 Instagram */}
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm mt-10 border-t border-orange-300 pt-4 text-orange-100">
        © {new Date().getFullYear()} 🔶 <span className="font-semibold">YourAppName</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
