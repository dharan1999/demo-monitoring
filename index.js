const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const appInsights = require('applicationinsights');

// Initialize Application Insights with Connection String
appInsights
    .setup('InstrumentationKey=8947814c-5d90-48f6-90bb-325d50465526;IngestionEndpoint=https://canadacentral-1.in.applicationinsights.azure.com/')
    .setAutoCollectConsole(true, true) // Optional, for logging console output
    .setAutoCollectExceptions(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectRequests(true)
    .start();

// Middleware to track requests
app.use((req, res, next) => {
    // Track incoming requests
    appInsights.defaultClient.trackRequest({ 
        name: req.method + ' ' + req.url, 
        url: req.url, 
        duration: 0, 
        resultCode: 200,
        success: true 
    });
    next();
});

// Middleware to parse JSON
app.use(express.json());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Track a custom metric
app.get('/custom-metric', (req, res) => {
    appInsights.defaultClient.trackEvent({ name: "Custom Metric Event", properties: { customProperty: "customValue" } });
    res.send('Custom metric tracked!');
});

// Simulate an error and track it
app.get('/error', (req, res) => {
    try {
        // Some code that may throw an error
        throw new Error('This is a sample error');
    } catch (err) {
        appInsights.defaultClient.trackException({ exception: err });
        res.status(500).send('An error occurred!');
    }
});

// Track performance
app.get('/performance', (req, res) => {
    const startTime = Date.now();
    // Simulate some processing
    setTimeout(() => {
        const duration = Date.now() - startTime;
        appInsights.defaultClient.trackTrace({ message: 'Performance trace example', properties: { duration } });
        res.send('Performance tracked!');
    }, 1000);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
