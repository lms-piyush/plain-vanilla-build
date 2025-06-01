
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('courses');
  
  const faqData = {
    courses: [
      {
        question: "How do I create and publish a course?",
        answer: "To create a course, go to the Classes section and click on 'Create New Class'. Fill in all the required details about your course including title, description, curriculum, and pricing. Once you're satisfied with all the information, click on 'Publish' to make your course available to students."
      },
      {
        question: "Can I edit course details after publishing?",
        answer: "Yes, you can edit your course details even after publishing. Navigate to the Classes section, find the course you want to edit, and click on the 'Edit' button. Make your changes and save them. Keep in mind that some changes might need approval from the admin team."
      },
      {
        question: "What type of content can I upload?",
        answer: "You can upload a variety of content including video lectures, PDFs, presentations, quizzes, and assignments. We support most common file formats including MP4, PDF, PPT, DOCX, and more. The maximum file size for videos is 2GB and for documents is 100MB."
      }
    ],
    profile: [
      {
        question: "How do I update my profile photo?",
        answer: "To update your profile photo, click on your profile icon in the top right corner, then select 'Edit Profile'. In the profile section, click on the current photo or the upload button to select a new image from your device. Crop as needed, then save changes."
      },
      {
        question: "How can I change my address or contact number?",
        answer: "To update your contact information, click on your profile icon in the top-right corner and select 'Edit Profile'. In the profile settings, you'll find sections for your address and contact details. Make the necessary changes and click 'Save Changes' to update your information."
      }
    ],
    payments: [
      {
        question: "When will I receive my payment?",
        answer: "Payments are processed on the 1st and 15th of every month for all earnings accumulated up to that point. Depending on your bank, it may take 2-5 business days for the funds to reflect in your account after processing."
      },
      {
        question: "How do I track my earnings?",
        answer: "You can track your earnings in the Earnings section of the dashboard. This shows a breakdown of your revenue by course, number of enrollments, and payment status. You can also view historical data and download detailed reports."
      },
      {
        question: "How can I download payment reports?",
        answer: "To download payment reports, go to the Earnings section and click on 'Reports'. Select the date range for the report you want, choose the format (PDF, CSV, or Excel), and click 'Generate Report'. Once generated, click 'Download' to save the report to your device."
      }
    ],
    bank: [
      {
        question: "How do I update my bank account?",
        answer: "To update your bank account details, click on your profile icon, then go to 'Edit Profile'. Navigate to the 'Payment Information' section where you can add or update your bank account information. Fill in all required fields and click 'Save Changes'."
      },
      {
        question: "What if I entered the wrong bank details?",
        answer: "If you've entered incorrect bank details, update them as soon as possible through your profile settings. If a payment was already processed with incorrect details, contact support immediately. Payments sent to incorrect accounts may take longer to retrieve and reprocess."
      }
    ]
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory('');
    } else {
      setExpandedCategory(category);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter FAQs based on search term
  const filteredFAQs = searchTerm ? 
    Object.fromEntries(
      Object.entries(faqData).map(([category, questions]) => [
        category,
        questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ]).filter(([_, questions]) => questions.length > 0)
    ) : 
    faqData;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Help Center</h1>

      {/* Search */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for help topics..."
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {Object.keys(filteredFAQs).map(category => (
          <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <button
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-lg font-semibold capitalize">{category === 'courses' ? 'How to List Courses' : category}</h2>
              {expandedCategory === category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedCategory === category && (
              <div className="px-6 pb-6 space-y-4">
                {(filteredFAQs[category] as any[]).map((faq, index) => (
                  <div key={index} className="border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-800">{faq.question}</h3>
                    <p className="mt-1 text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {Object.keys(filteredFAQs).length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No results found for "{searchTerm}". Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
