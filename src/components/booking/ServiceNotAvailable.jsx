import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

export function ServiceNotAvailable({ country }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Service Not Available
            </h1>
            <p className="text-slate-300 text-lg">
              We're currently serving customers in Australia only
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-10">

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Why is this service restricted?</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-1">•</span>
                    <span>We operate exclusively within Australian states and territories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-1">•</span>
                    <span>Our team of licensed professionals is based in Australia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-1">•</span>
                    <span>We comply with Australian building codes and standards</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button
                onClick={() => navigate('/gallery')}
                variant="outline"
                className="flex-1"
              >
                View Our Work
              </Button>
            </div>
          </div>


        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-500 text-xs mt-6">
          If you believe this is an error, please contact our support team
        </p>
      </div>
    </div>
  );
}

