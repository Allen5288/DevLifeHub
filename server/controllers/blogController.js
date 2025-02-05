const BlogPost = require('../models/BlogPost')

exports.getAllPosts = async (req, res) => {
  try {
    const { category } = req.query
    const query = category ? { category } : {}
    const posts = await BlogPost.find(query).sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createPost = async (req, res) => {
  try {
    const post = new BlogPost(req.body)
    const savedPost = await post.save()
    res.status(201).json(savedPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.addComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    post.comments.push(req.body)
    const updatedPost = await post.save()
    res.status(201).json(updatedPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
