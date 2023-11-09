const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Blog = require('../models/blog')
const User = require('../models/user')
const City = require('../models/city')
const mongoose = require("mongoose");

router.post('/blog2', auth, async (req,res) => {
    const blog = new Blog({
        blog: req.body.blog,
        city: req.body.city,
        country: req.body.country,
        region: req.body.region,
        username: req.body.username,
        category: req.body.category,
        user: req.user._id
    })

    const city = new City({
        city: req.body.city,
        country: req.body.country,
        region: req.body.region
    })

    try{
        await blog.save()
        await city.save()
        res.status(201).send(blog)
        res.status(201).send(city)
    } catch (e) {
        res.status(400).send(e)
    }
})

//post a new blog
router.post('/blog', auth, async (req, res) => {

    const blog = new Blog({
        blog: req.body.blog,
        city: req.body.city,
        country: req.body.country,
        region: req.body.region,
        username: req.body.username,
        category: req.body.category,
        user: req.body.userId
    })

    const city = new City({
        city: req.body.city,
        country: req.body.country,
        region: req.body.region
    })

    try{
        await blog.save()
        await city.save()
        res.status(201).send(blog)
        res.status(201).send(city)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get all blog
router.get('/blog', async (req, res) => {
    try{
        const blogs = await Blog.find()
        res.send(blogs)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Get blog for specific city
router.get('/blog/:region/:country/:city', async (req, res) => {
    try{
        const blogs = await Blog.find({
            region: req.params.region,
            country: req.params.country,
            city: req.params.city
        })
        .select('blog username')
        res.send(blogs)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Get blog with a specific username 
router.get('/blog/:userId', async (req, res) => {
    try{
        const blogs = await Blog.find({
            userId:req.params.userId
        })
        res.send(blogs)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Get blog for specific city and category
router.get('/blog/:region/:country/:city/:category', async (req, res) => {
    try{
        const blogs = await Blog.find({
            region: req.params.region,
            country: req.params.country,
            city: req.params.city,
            category: req.params.category
        })
        res.send(blogs)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Edit Blog
router.patch('/blog/:blogId', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['blog']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const blog = await Blog.findOne({_id:req.params.blogId, author:req.user._id})

        if (!blog) {
            return res.status(404).send()
        }

        updates.forEach((update) => blog[update] = req.body[update])
        await blog.save()

        res.send(blog)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete blog
router.delete('/blog/:blogId', auth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({_id:req.params.blogId})

        if (!blog){
            res.status(404).send('blog does not exist')
        }
        res.send(204).send(blog)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router