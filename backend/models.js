const mongoose = require('mongoose')

// A mobiltelefonok gyártói pl.: Apple, Samsung, stb. vannak az egyik kollekcióban
// A másik kollekcióban a mobiltelefonok vannak, amiknek a gyártói az előző kollekcióban vannak
// A két kollekció között kapcsolat van, mert a telefonoknak van egy gyártója
// A kapcsolat egy a többhöz, mert egy gyártóhoz több telefon is tartozhat
// A kapcsolatot a telefonok gyártója azonosítója (_id) biztosítja

const mobilGyartoSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  nev: {
    type: String,
    required: true,
    unique: true,
    maxlength: [30, 'A név nem tartalmazhat 30 karakternél többet!'],
  },
  alapitva: Number,
  elnok: String
})


const telefonSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'Az azonosító megadása kötelező!']
    },
    nev: {
        type: String,
        required: [true, 'A név megadása kötelező!'],
        unique: true,
        maxlength: [50, 'A név nem lehet hosszabb 50 karakternél!']
    },
    ar: {
        type: Number,
        default: 0
    },
    gyartId: {
        type: Number,
        ref: 'MobilGyarto'
    }
})

module.exports.MobilGyarto = mongoose.model('MobilGyarto', mobilGyartoSchema, 'gyartok') // gyartok névvel lesz létrehozva a kollekció (kis és nagy betű számít!!!).
module.exports.Telefon = mongoose.model('Telefon', telefonSchema, 'mobilok') // mobilok névvel lesz létrehozva a kollekció (kis és nagy betű számít!!!).