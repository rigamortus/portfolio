// create-recruiter-page.js
// Run with: node create-recruiter-page.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');
const http = require('http');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Your projects data - update with your actual project information
const videoTemplates = [
  {
    title: "Infrastructure as Code with Terraform",
    description: "Building and managing AWS infrastructure using Terraform modules, demonstrating state management and best practices.",
    loomUrl: "https://github.com/yourusername/terraform-aws-project",
    tools: ["Terraform", "AWS", "IaC"]
  },
  {
    title: "Kubernetes Deployment Patterns",
    description: "Implementing blue-green deployments in Kubernetes using custom controllers and helm charts.",
    loomUrl: "https://github.com/yourusername/kubernetes-deployment-patterns",
    tools: ["Kubernetes", "Helm", "Docker"]
  },
  {
    title: "CI/CD Pipeline with GitHub Actions",
    description: "Setting up automated testing and deployment pipeline for a microservices architecture.",
    loomUrl: "https://github.com/yourusername/github-actions-cicd",
    tools: ["GitHub Actions", "Docker", "AWS"]
  },
  {
    title: "Monitoring and Alerting Setup",
    description: "Setting up observability for a web application with Prometheus and Grafana.",
    loomUrl: "https://github.com/yourusername/prometheus-grafana-setup",
    tools: ["Prometheus", "Grafana", "Kubernetes"]
  }
];

// Your contact information - update with your actual contact information
const contactTemplate = {
  email: "your.email@example.com",
  linkedin: "https://linkedin.com/in/your-profile",
  resumeUrl: "/resume.pdf"
};

// Function to prompt user for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Function to make HTTP request
const makeRequest = (url, method, data) => {
  return new Promise((resolve, reject) => {
    // Determine if http or https
    const httpModule = url.startsWith('https') ? https : http;
    
    // Parse URL to get hostname, path, etc.
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const req = httpModule.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (e) {
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

// Main function
const createRecruiterPage = async () => {
  console.log("DevOps Portfolio - Create Recruiter Page\n");
  
  // Get recruiter information
  const recruiterName = await prompt("Recruiter's name: ");
  const recruiterPosition = await prompt("Recruiter's position: ");
  const recruiterCompany = await prompt("Recruiter's company: ");
  
  // Select videos
  console.log("\nSelect 3 videos to include (comma-separated numbers):");
  videoTemplates.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title}`);
  });
  
  const videoSelections = await prompt("Enter selections (e.g., 1,3,4): ");
  const selectedIndexes = videoSelections.split(',').map(n => parseInt(n.trim()) - 1);
  
  if (selectedIndexes.length !== 3 || selectedIndexes.some(i => i < 0 || i >= videoTemplates.length)) {
    console.error("Please select exactly 3 valid video numbers.");
    rl.close();
    return;
  }
  
  const selectedVideos = selectedIndexes.map(i => videoTemplates[i]);
  
  // Create the page data
  const pageData = {
    recruiter: {
      name: recruiterName,
      position: recruiterPosition,
      company: recruiterCompany
    },
    videos: selectedVideos,
    contact: contactTemplate
  };
  
  try {
    // Get the server URL
    const serverUrl = await prompt("\nEnter your app URL (e.g., https://your-app.azurewebsites.net): ");
    
    console.log("\nCreating page...");
    const response = await makeRequest(`${serverUrl}/api/create-page`, 'POST', pageData);
    
    if (response.success) {
      console.log(`\nSuccess! Page created at: ${serverUrl}${response.pageUrl}`);
      console.log(`Send this link to ${recruiterName} at ${recruiterCompany}`);
    } else {
      console.error("Error creating page:", response.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
  
  rl.close();
};

// Run the main function
createRecruiterPage();