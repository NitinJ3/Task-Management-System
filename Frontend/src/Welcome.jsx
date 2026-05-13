import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Users, Layout, Calendar } from "lucide-react"; 

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* --- Navigation Bar --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">Task Management System</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#workflow" className="hover:text-indigo-600 transition">Workflow</a>
        </div>
        <button 
          onClick={() => navigate("/login")}
          className="text-indigo-600 font-semibold hover:text-indigo-700"
        >
          Log in
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 -z-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Manage your Tasks <br /> 
            <span className="text-indigo-600 font-black"> With Ease</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A platform for efficient project management, task tracking, and team coordination. 
            From project creation to employee leave tracking—everything in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button 
              onClick={() => navigate("/signup")}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-600 hover:text-indigo-600 font-bold rounded-xl transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to lead</h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-indigo-600" />}
              title="Hierarchical Roles"
              desc="Separate access for Department Heads, Team Leaders, and Employees. Maintain clear boundaries."
            />
            <FeatureCard 
              icon={<Layout className="text-indigo-600" />}
              title="Project Oversight"
              desc="Create multiple projects and assign dedicated leaders to ensure every task is monitored."
            />
            <FeatureCard 
              icon={<Calendar className="text-indigo-600" />}
              title="Leave Management"
              desc="Integrated leave request system. Approve or reject leaves to plan your resource allocation better."
            />
          </div>
        </div>
      </section>

      {/* --- Workflow Section (How it works) --- */}
      <section id="workflow" className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-indigo-900 rounded-3xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Simplified Workflow</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-indigo-400" />
                  <span>Register your Department with a unique code</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-indigo-400" />
                  <span>Generate employee invite codes securely</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-indigo-400" />
                  <span>Assign tasks and track completion status</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-indigo-400" />
                  <span>Review leaves and adjust deadlines</span>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-800/50 p-8 rounded-2xl border border-indigo-700">
              <div className="text-sm font-mono text-indigo-300 mb-2">// System Stats</div>
              <div className="text-4xl font-bold">100%</div>
              <p className="text-indigo-200 text-sm mt-1">Real-time Task Visibility</p>
              <div className="mt-6 h-2 bg-indigo-700 rounded-full">
                <div className="h-full w-3/4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>© 2026 Task Management System | Internship Project</p>
      </footer>
    </div>
  );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default Welcome;