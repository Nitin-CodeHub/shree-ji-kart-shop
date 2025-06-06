
import React from 'react';
import { Truck, Clock, Shield, Phone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-orange-600" />,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹500 within 5km radius"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Quick Service",
      description: "Get your groceries delivered within 30 minutes"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Quality Assured",
      description: "Fresh products with 100% quality guarantee"
    },
    {
      icon: <Phone className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Round the clock customer support for your queries"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Shree Ji Kirana Store?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing you with the best shopping experience and highest quality products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-50 transition-colors duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
