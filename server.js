const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const postsFile = path.join(__dirname, 'data', 'posts.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static routes
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

let posts = []
if(fs.existsSync(postsFile)) {
  const data = fs.readFileSync(postsFile)
  posts = JSON.parse(data)
}
function savePostsToFile() {
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2))
}

// Post submission
app.post('/submit-post', (req, res) => {
  const { title, content, tags } = req.body;
  const newPost = {
    title,
    content,
    tags,
    date: new Date().toISOString()
  };

  posts.push(newPost);
  savePostsToFile();
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
