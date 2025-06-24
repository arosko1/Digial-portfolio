import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitMessage('Thank you! Your message has been sent successfully. I will get back to you within 24 hours.');
        setFormData({ name: '', email: '', service: '', message: '' });
      } else {
        setSubmitMessage('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('There was an error sending your message. Please email me directly.');
    }
    
    setIsSubmitting(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  const services = [
    {
      title: "Academic Writing",
      image: "https://images.unsplash.com/photo-1537202108838-e7072bad1927",
      description: "Comprehensive academic writing services including thesis, proposals, dissertations, and research papers.",
      features: ["Thesis & Dissertations", "Research Proposals", "Academic Assignments", "Literature Reviews", "All Referencing Styles"]
    },
    {
      title: "Technical Writing",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
      description: "Professional technical documentation and specialized content creation for various industries.",
      features: ["Cryptocurrency Whitepapers", "Technical Documentation", "User Manuals", "API Documentation", "Industry Reports"]
    },
    {
      title: "Content & Editing",
      image: "https://images.pexels.com/photos/3631711/pexels-photo-3631711.jpeg",
      description: "Expert editing and content creation services for websites, blogs, and marketing materials.",
      features: ["Website Content", "Blog Articles", "Copy Editing", "Proofreading", "SEO-Optimized Content"]
    }
  ];

  const skills = [
    "100% Plagiarism-Free Content",
    "Multiple Referencing Styles (APA, MLA, Chicago, Harvard)",
    "Grammar & Style Perfection",
    "Research & Analysis",
    "SEO Optimization",
    "Social Media Content",
    "Microsoft Office Suite",
    "Academic Research Methods"
  ];

  const certifications = [
    { name: "Product Design (UI/UX)", year: "2022", provider: "Side Hustle" },
    { name: "SEO Certification", year: "2018", provider: "Udemy" },
    { name: "Certified Digital Marketer", year: "2017", provider: "Udemy" },
    { name: "Microsoft Mastery", year: "2013", provider: "Udemy" },
    { name: "Certified Social Media Influencer", year: "2019", provider: "MamaTee" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">
              Professional Writing Services
            </div>
            <div className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-blue-600 transition-colors">Services</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-blue-600 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Professional
                <span className="text-blue-600"> Ghost Writing</span>
                <br />Services
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Delivering exceptional academic, technical, and content writing with over 5 years of proven expertise. 
                From thesis and research papers to cryptocurrency whitepapers and website content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Get Started Today
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  View Services
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">100%</div>
                  <div className="text-gray-600">Plagiarism Free</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">500+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.pexels.com/photos/7982890/pexels-photo-7982890.jpeg" 
                alt="Professional Writing Services"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">My Writing Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive writing solutions tailored to your specific needs, delivered with precision and expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">About Me</h2>
              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  I am a versatile technical and academic writer with over five years of proven experience in delivering 
                  high-quality content across diverse industries and academic disciplines.
                </p>
                <p>
                  Throughout my career, I have specialized in academic writing, technical documentation, and content creation, 
                  helping students achieve significant milestones in their academic pursuits while assisting businesses 
                  with professional documentation needs.
                </p>
                <p>
                  My expertise spans cryptocurrency whitepapers, academic research papers, website content, and comprehensive 
                  technical documentation. I pride myself on delivering 100% plagiarism-free content with impeccable grammar 
                  and adherence to various referencing styles.
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Education & Background</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800">Bachelor of Aquaculture and Fisheries Management</h4>
                    <p className="text-gray-600">Federal University of Agriculture, Abeokuta, Nigeria • 2015</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-800">Transforming Nigerian Youths Program</h4>
                    <p className="text-gray-600">Pan-Atlantic University, Nigeria • 2020</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a" 
                alt="Professional Writing"
                className="w-full rounded-2xl shadow-2xl mb-8"
              />
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Experience Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Academic Writer</h4>
                      <p className="text-gray-600">American InterContinental University • 2018 - Present</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Freelance Writer</h4>
                      <p className="text-gray-600">Freelancer & Upwork Platforms • 2017 - Present</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Core Skills</h2>
              <div className="grid grid-cols-1 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-800">{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Certifications</h2>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{cert.provider}</span>
                      <span className="text-blue-600 font-semibold">{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your project? Let's discuss your writing needs and create exceptional content together.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">@</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">Available upon request</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">⏰</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Response Time</h4>
                      <p className="text-gray-600">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🌍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Availability</h4>
                      <p className="text-gray-600">Available for projects worldwide</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-3">Why Choose My Services?</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      5+ years of proven experience
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      100% original, plagiarism-free content
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Timely delivery guaranteed
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Multiple revisions included
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Service Needed</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="academic-writing">Academic Writing</option>
                      <option value="technical-writing">Technical Writing</option>
                      <option value="content-editing">Content & Editing</option>
                      <option value="cryptocurrency-whitepaper">Cryptocurrency Whitepaper</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Project Details</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please describe your project requirements, timeline, and any specific needs..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${submitMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {submitMessage}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Professional Writing Services</h3>
            <p className="text-gray-400 mb-6">
              Delivering exceptional writing solutions with 5+ years of expertise
            </p>
            <div className="flex justify-center space-x-6">
              <span className="text-gray-400">Academic Writing</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">Technical Writing</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">Content & Editing</span>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400">
                © 2024 Professional Writing Services. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;