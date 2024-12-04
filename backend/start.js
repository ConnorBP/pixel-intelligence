import app from './testapproutes.js';

// Start the server on port 3000
const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}/api`);
});