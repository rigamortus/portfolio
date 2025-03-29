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
    title: "Python Application Deployment on AKS",
    description: "Deployment of Python application on AKS using Terraform modules and GitHub Actions. Includes implementation of code and image scanning with SonarQube and Snyk as well as Kubernetes/Docker security practices (run as nonroot, seccomp, restricted capabilities, read-only root filesystem, unmounting of service account token). Monitoring with Prometheus, Grafana, and Microsoft Teams channel alerts via a webhook.",
    loomUrl: "https://github.com/rigamortus/infiniongt",
    tools: ["Terraform", "Azure", "IaC", "Kubernetes", "GitHub Actions", "SonarQube", "Snyk", "Prometheus", "Grafana", "Docker"]
  },
  {
    title: "QR Code Generator - Lambda, S3, API Gateway.",
    description: "QR code generator using AWS Resources",
    loomUrl: "https://github.com/rigamortus/mynewrepo",
    tools: ["Terraform", "AWS Lambda", "S3", "API Gateway", "Python"]
  },
  {
    title: "Laravel Web Application on AWS Using Ansible",
    description: "Deployment of a Laravel web application on AWS using Ansible. This project includes setting up an EC2 instance, configuring security groups, and deploying the application with Ansible playbooks.",
    loomUrl: "https://github.com/rigamortus/devops-projects/tree/main/ansible-redone",
    tools: ["AWS", "Ansible", "Laravel", "EC2"]
  },
  {
    title: "Static Website on Azure",
    description: "Geo-routing of a static website using Azure DNS and Terraform. The project includes setting up a static website on Azure Blob Storage, configuring DNS records, and implementing geo-routing based on user location.",
    loomUrl: "https://github.com/rigamortus/devops-projects/tree/main/azuretask",
    tools: ["Terraform", "Azure", "DNS"]
  }
];

// Your contact information - update with your actual contact information
const contactTemplate = {
  email: "david akalugo@gmail.com",
  linkedin: "https://linkedin.com/in/david-akalugo",
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