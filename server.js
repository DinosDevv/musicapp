const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const posts = []; // Temporary in-memory database

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static routes
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

// Post submission
app.post('/submit-post', (req, res) => {
  const { title, content, tags } = req.body;
  posts.push({ title, content, tags, date: new Date() });
  res.redirect('/discover');
});

// Discover route (EJS dynamic render)
app.get("/discover", (req, res) => {
  res.render("discover", { posts });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 App is running on http://localhost:${port}`);
});
