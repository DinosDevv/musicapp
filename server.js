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

const multer = require('multer');

const uploadFolder = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Ρυθμίσεις για αποθήκευση εικόνας
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Post submission
app.post('/submit-post', upload.single('image'), (req, res) => {
  const { title, content, tags } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const newPost = {
    title,
    content,
    tags,
    image: imagePath,
    date: new Date().toISOString()
  };

  posts.push(newPost);
  savePostsToFile();
  res.redirect('/discover');
});
function formatDate(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffMs = now - postDate;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays <= 5) return `${diffDays} days ago`;

  return postDate.toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Discover route (EJS dynamic render)
app.get("/discover", (req, res) => {
  const formattedPosts = posts.map(post => ({
    ...post,
    formattedDate: formatDate(post.date)
  }));

  res.render("discover", {
    posts: formattedPosts
  })
});

// Start server
app.listen(port, () => {
  console.log(`🚀 App is running on http://localhost:${port}`);
});
