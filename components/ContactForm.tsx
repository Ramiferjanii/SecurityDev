'use client';

import { useState } from 'react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { Button } from '@/components/ui/stateful-button';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Message sent successfully!');
      } else {
        console.error('Failed to submit form');
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
       console.error('Error submitting form:', error);
       alert('An error occurred.');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="w-full mb-12 relative z-20">
      <div className="bg-blue-900/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto hover:bg-blue-900/20 transition-colors">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Contact Support</h2>
        <p className="text-neutral-300 mb-8 max-w-md mx-auto">
          Submit specific problems directly to our engineering team.
        </p>

        <form 
          className="space-y-4 max-w-md mx-auto text-left" 
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Name</label>
            <PlaceholdersAndVanishInput
              placeholders={["John Doe", "Jane Smith", "Anonymous User"]}
              onChange={handleChange('name')}
              value={formData.name}
              name="name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Email</label>
            <PlaceholdersAndVanishInput
              placeholders={["john@example.com", "contact@company.com"]}
              onChange={handleChange('email')}
              value={formData.email}
              name="email"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Subject</label>
             <PlaceholdersAndVanishInput
              placeholders={["Bug Report", "Feature Request", "Account Issue"]}
              onChange={handleChange('subject')}
              value={formData.subject}
              name="subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1 ml-2">Message</label>
            <textarea
              value={formData.message}
              onChange={handleChange('message')}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div className="pt-2 flex justify-center">
            <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                onClick={(e: any) => handleSubmit(e)}
            >
                Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
