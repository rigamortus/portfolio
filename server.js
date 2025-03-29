// server.js
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

// Azure App Service will set process.env.PORT
const PORT = process.env.PORT || 3000;

// Set up the application
const app = express();
app.use(express.json());

// Store for tracking recruiter pages
// In Azure App Service, use a location that's writable by the app
const DATA_DIR = process.env.AZURE_APP_DATA_DIR || '.';
const TRACKER_FILE = path.join(DATA_DIR, 'recruiter-tracker.json');

// Helper to generate unique URLs
const generateUniqueId = () => crypto.randomBytes(4).toString('hex');

// Helper to read/write tracker file
const getTrackerData = async () => {
  try {
    const data = await fs.readFile(TRACKER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
};

const saveTrackerData = async (data) => {
  await fs.writeFile(TRACKER_FILE, JSON.stringify(data, null, 2));
};

// API endpoint to create a new recruiter page
app.post('/api/create-page', async (req, res) => {
  try {
    const { recruiter, videos, contact } = req.body;
    
    // Generate unique ID for the page
    const pageId = generateUniqueId();
    
    // Create page data
    const pageData = {
      id: pageId,
      recruiter,
      videos,
      contact,
      createdAt: new Date().toISOString(),
      views: 0,
      lastViewed: null
    };
    
    // Save to tracker
    const trackerData = await getTrackerData();
    trackerData.push(pageData);
    await saveTrackerData(trackerData);
    
    res.json({
      success: true,
      pageUrl: `/view/${pageId}`
    });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Serve page with custom data
app.get('/view/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const trackerData = await getTrackerData();
    const pageData = trackerData.find(page => page.id === pageId);
    
    if (!pageData) {
      return res.status(404).send('Page not found');
    }
    
    // Update view count and last viewed timestamp
    pageData.views += 1;
    pageData.lastViewed = new Date().toISOString();
    await saveTrackerData(trackerData);
    
    // Inject pageData into HTML template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Portfolio for ${pageData.recruiter.name}</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            window.PAGE_DATA = ${JSON.stringify(pageData)};
          </script>
          <script src="/static/bundle.js"></script>
        </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Error serving page:', error);
    res.status(500).send('Server error');
  }
});

// API endpoint to get page statistics
app.get('/api/stats', async (req, res) => {
  try {
    const trackerData = await getTrackerData();
    const stats = trackerData.map(({ id, recruiter, createdAt, views, lastViewed }) => ({
      id,
      recruiterName: recruiter.name,
      recruiterCompany: recruiter.company,
      createdAt,
      views,
      lastViewed
    }));
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Serve static files (React app)
app.use('/static', express.static(path.join(__dirname, 'build')));

// Serve React app for routes not handled (SPA fallback)
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (!req.path.startsWith('/api') && !req.path.startsWith('/view')) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});

// Make sure the data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`Data directory created at: ${DATA_DIR}`);
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
};

// Start the server
app.listen(PORT, async () => {
  await ensureDataDir();
  console.log(`Server running on port ${PORT}`);
});