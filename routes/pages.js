const express = require('express')
const router = express.Router()
const path = require('path')

const getPage = (filename) => path.join(__dirname, '..', 'public', filename)

router.get('/', (req, res) => {
  res.sendFile(getPage('mainpage.html'))
})
router.get('/profile', (req, res) => {
  res.sendFile(getPage('profile.html'))
})
router.get('/login', (req, res) => {
  res.sendFile(getPage('login-signup.html'))
})
router.get('/dashboard', (req, res) => {
  res.sendFile(getPage('dashboard.html'))
})
router.get('/post', (req, res) => {
  res.sendFile(getPage('post.html'))

})

module.exports = router