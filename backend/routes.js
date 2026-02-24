const express = require('express');
const { MobilGyarto, Telefon } = require('./models');

const router = express.Router()

//POST Új telefon felvitele
router.post('/mobilok', async (req, res) => {
    try{
        const ujTelefon = await Telefon.create(req.body);
        res.status(201).json({"_id": ujTelefon._id})
    }
    catch(error){
        if (error.name === 'ValidationError') {
            return res.status(400).json({message: "Hiányos vagy érvénytelen adatok"})
        }

        if (error.code === 11000) {
            return res.status(409).json({message: "Már létezik ilyen telefon"})
        }

        console.error(error)
        res.status(500).json({message: "Szerver hiba"})
    }
})

//GET összes gyártó lekérése
router.get('/gyartok', async (req, res) => {
    try{
        const data = await MobilGyarto.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//GET összes mobil lekérése a gyártó adataival együtt (populate)
router.get('/mobilok', async (req, res) => {
    try{
        const data = await Telefon.find().populate('gyartId', '-_id');
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//GET egy adott ID-jű gyártó összes telefonjának lekérése a gyártó adataival együtt
router.get('/gyartok/:gyartoId/mobilok', async (req, res) => {
    try{
        const data = await Telefon.find({"gyartId": req.params.gyartoId})
        .populate('gyartId', '-_id')
        if (data.length !== 0) {
            res.json(data)
        } else {
            res.status(404).json({message: 'Nincs olyan telefon az adatbázisban, amit ez a gyártó gyártott.'})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//PATCH adott ID-jű telefon frissítése
router.patch('/mobilok/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true, runValidators: true }; 
        // hogy a frissítés utáni dokumentumot kapjuk vissza
        const result = await Telefon.findByIdAndUpdate(
            id, updatedData, options
        )
        if (result) {
            res.send(result)
        } else {
            res.status(404).json({ message: `${id} azonosítóval nem létezik telefon!`  })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//DELETE adott ID-jű telefon törlése
router.delete('/mobilok/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Telefon.findByIdAndDelete(id)
        res.send(`A ${data.nev} nevű telefon törölve lett.`)
	// Ha csak a 204-es státuszkódot akarod visszaküldeni, akkor: res.sendStatus(204)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;