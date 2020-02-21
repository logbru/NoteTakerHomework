const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Parameter /users/'username'
// /users/:name/:otherparam
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    res.json(JSON.parse(data))
  })
})

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const notes = JSON.parse(data)
    let note = req.body
    note.id = notes.length
    notes.push(note)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) { console.log(err) }
      res.json(req.body)
    })
  })
})

app.post('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    let notes = JSON.parse(data)

    let id = parseInt(req.param.id)
    for (var i = notes.length - 1; i >= 0; --i) {
      if (notes[i].id == id) {
        notes.splice(i, 1);
      }
    }
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) { console.log(err) }
      res.sendStatus(200)
    })
  })
})

app.listen(3000)