import React from 'react';
import { Heart, Star, Calendar, Users, Camera, Music, Sparkles, Award } from 'lucide-react';

export default function EventPortfolio() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="py-6 px-8" style={{ background: 'linear-gradient(to right, #66cef6, #f666b1)' }}>
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <Heart className="w-12 h-12 mx-auto text-white mb-2" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">
            Dream Events
          </h1>
          <p className="text-lg text-white/90 animate-fade-in">
            Creating Magical Moments That Last Forever
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-16">

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 mb-16">
        {[
          { icon: Calendar, number: "500+", label: "Events Organized" },
          { icon: Heart, number: "200+", label: "Dream Weddings" },
          { icon: Users, number: "10K+", label: "Happy Guests" },
          { icon: Award, number: "50+", label: "Awards Won" }
        ].map((stat, index) => (
          <div key={index} className="text-center transform hover:scale-110 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-400 to-pink-400 rounded-full p-6 mx-auto w-20 h-20 flex items-center justify-center mb-4 animate-spin-slow">
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 animate-pulse">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Gallery */}
      <div className="px-8 mb-16">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 animate-fade-in">
          Our Magical Portfolio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Enchanted Garden Wedding",
              description: "A magical outdoor ceremony surrounded by blooming flowers and fairy lights",
              image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
              tags: ["Wedding", "Outdoor", "Garden"]
            },
            {
              title: "Royal Palace Reception",
              description: "Elegant ballroom celebration with crystal chandeliers and golden decor",
              image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
              tags: ["Reception", "Luxury", "Indoor"]
            },
            {
              title: "Beach Sunset Ceremony",
              description: "Romantic beachside vows with ocean waves and golden hour lighting",
              image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
              tags: ["Beach", "Sunset", "Romantic"]
            },
            {
              title: "Vintage Barn Celebration",
              description: "Rustic charm meets modern elegance in this countryside venue",
              image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
              tags: ["Rustic", "Barn", "Vintage"]
            },
            {
              title: "City Rooftop Party",
              description: "Urban skyline backdrop for an unforgettable celebration",
              image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
              tags: ["Urban", "Rooftop", "Modern"]
            },
            {
              title: "Fairytale Castle Event",
              description: "Medieval castle setting for a truly royal celebration",
              image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop",
              tags: ["Castle", "Fairytale", "Historic"]
            }
          ].map((event, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:animate-pulse">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-pink-100 text-gray-700 rounded-full text-xs animate-fade-in">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="px-8 mb-16">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 animate-fade-in">
          Our Premium Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Wedding Planning", desc: "Complete wedding coordination from dream to reality" },
            { icon: Camera, title: "Photography", desc: "Professional photography to capture every precious moment" },
            { icon: Music, title: "Entertainment", desc: "DJ services, live bands, and musical entertainment" },
            { icon: Users, title: "Catering", desc: "Exquisite dining experiences for all your guests" },
            { icon: Sparkles, title: "Decoration", desc: "Stunning floral arrangements and venue decoration" },
            { icon: Calendar, title: "Event Coordination", desc: "Seamless timeline management and vendor coordination" }
          ].map((service, index) => (
            <div key={index} className="bg-gray-50 shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-400 to-pink-400 rounded-full p-4 w-16 h-16 mx-auto mb-6 animate-bounce">
                <service.icon className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-pulse">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-8 mb-16">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 animate-fade-in">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Sarah & John", text: "Dream Events made our wedding absolutely perfect! Every detail was flawless.", rating: 5 },
            { name: "Maria Rodriguez", text: "Professional, creative, and exceeded all our expectations. Highly recommended!", rating: 5 },
            { name: "Ahmed & Fatima", text: "They turned our vision into reality. The most beautiful celebration ever!", rating: 5 }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-50 shadow-lg rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="text-gray-800 font-semibold">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-pulse">
          Ready to Create Your Dream Event?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Let's turn your vision into an unforgettable celebration
        </p>
        <button className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-12 py-4 rounded-full text-xl font-bold transform hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-bounce">
          Contact Us Today
        </button>
      </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-10 animate-float">
        <Heart className="w-8 h-8 text-blue-300/40" />
      </div>
      <div className="fixed top-1/3 right-10 animate-float-delayed">
        <Sparkles className="w-6 h-6 text-pink-300/40" />
      </div>
      <div className="fixed bottom-1/4 left-20 animate-float">
        <Star className="w-7 h-7 text-purple-300/40" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}