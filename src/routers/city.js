const express = require('express')
const City = require('../models/city')
const router = new express.Router()
const auth = require('../middleware/auth')

//post a new city
router.post('/city/:country', auth, async (req, res) => {

    const city = new City({
        city:req.body.city,
        author: req.user._id,
        country: req.params.country
    })

    try{
        await city.save()
        res.status(201).send(city)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get all city
router.get('/city', async (req,res) => {
    try{
        const cities = await City.find()
        res.send(cities)
    } catch(e){
        res.status(500).send(e)
    }
})

//Get specific city in a country
router.get('/city/:country', async (req, res) => {
    try{
        const cities = await City.find({country:req.params.country})
        res.send(cities)
    } catch(e){
        res.status(500).send(e)
    }
})

//Get specific city in a country with aggregate 
router.get('/cities/:country', async (req, res) => {
    try{
        const cities = await City.aggregate(
            [
                {$match: {country: req.params.country}},
                {$group: {
                    _id: "$city",
                    total: {$sum: 1},
                    country: {$push:"$country"},
                    region: {$push:"$region"}
                }},
                {$sort:{"total": -1}}
            ]
        )
        res.send(cities)
    } catch(e){
        res.status(500).send(e)
    }
})

//Delete specific city
router.delete('/city/:cityId', auth, async (req, res) => {
    try{
        const city = await City.findOneAndDelete({_id:req.params.cityId})

        if(!city) {
            res.status(404).send('city does not exist')
        }

        res.send(204).send(city)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router