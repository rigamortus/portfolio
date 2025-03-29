import React from 'react';
import { Mail, Download, Linkedin } from 'lucide-react';

const PortfolioPage = () => {
  // Get data injected by the server
  const pageData = window.PAGE_DATA || {
    recruiter: {
      name: "Sarah Johnson",
      position: "Technical Recruiter at TechCorp",
      company: "TechCorp"
    },
    videos: [
      {
        title: "Infrastructure as Code with Terraform",
        description: "Building and managing AWS infrastructure using Terraform modules, demonstrating state management and best practices.",
        loomUrl: "https://www.loom.com/embed/your-video-id-1",
        tools: ["Terraform", "AWS", "IaC"]
      },
      {
        title: "Kubernetes Deployment Patterns",
        description: "Implementing blue-green deployments in Kubernetes using custom controllers and helm charts.",
        loomUrl: "https://www.loom.com/embed/your-video-id-2",
        tools: ["Kubernetes", "Helm", "Docker"]
      },
      {
        title: "CI/CD Pipeline with GitHub Actions",
        description: "Setting up automated testing and deployment pipeline for a microservices architecture.",
        loomUrl: "https://www.loom.com/embed/your-video-id-3",
        tools: ["GitHub Actions", "Docker", "AWS"]
      }
    ],
    contact: {
      email: "your.email@example.com",
      linkedin: "https://linkedin.com/in/your-profile",
      resumeUrl: "/path-to-your-resume.pdf"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hi {pageData.recruiter.name}!
        </h1>
        <p className="text-sm text-gray-600 mb-4">{pageData.recruiter.position}</p>
        <p className="text-lg text-gray-700">
          I noticed {pageData.recruiter.company} is looking for DevOps expertise. 
          Here are three projects demonstrating relevant skills from your job description:
        </p>
      </header>

      {/* Video Grid */}
      <div className="max-w-4xl mx-auto grid gap-8 mb-12">
        {pageData.videos.map((video, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {video.loomUrl.includes('loom.com') ? (
              // Display Loom video if it's a Loom URL
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={video.loomUrl}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              // Display GitHub repo card if it's not a Loom URL
              <div className="p-4 bg-gray-100 rounded-t-lg">
                <a href={video.loomUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span className="font-medium">View GitHub Repository</span>
                </a>
                <p className="mt-2 text-gray-700 text-sm">Check out the code and documentation on GitHub</p>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {video.title}
              </h2>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <div className="flex flex-wrap gap-2">
                {video.tools.map((tool, toolIndex) => (
                  <span
                    key={toolIndex}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <footer className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Let's Connect</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={`mailto:${pageData.contact.email}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Mail size={20} />
            Email Me
          </a>
          <a
            href={pageData.contact.linkedin}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            <Linkedin size={20} />
            LinkedIn Profile
          </a>
          <a
            href={pageData.contact.resumeUrl}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            <Download size={20} />
            Download CV
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;