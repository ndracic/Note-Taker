const express = require('express');
const path = require('path');
const fs = require("fs")
const util = require('util')

const PORT = process.env.PORT || 3001;
const app = express();


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Middleware for parsing JSON and urlencoded form data
//data parsing
app.use(express.static('./develop/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api route get req
app.get("/api/notes", (req,res) => {
  readFileAsync("./db/db.json", "utf-8").then(function(data) {
    notes =[].concat(JSON.parse(data))
    res.json(notes);
  })
});

app.post("/api/notes", (req,res)=>{
  const note = req.body
  readFileAsync("./develop/db/db.json", "utf-8").then(function(data){
    notes =[].concat(JSON.parse(data));
    note.id =note.length + 1
    notes.push(note);
    return notes
  }).then(function(notes) {
    writeFileAsync('./develop/db/db.json'.JSON.stringify(notes))
    res.json(note);
  })
});

app.delete('/api/notes/:id', (req,res)=>{
  const idToDelete = parseInt(req.params.id);
  readFileAsync('./develop.db/db.json', 'utf-8').then(function(data){
    const notes =[].concat(JSON.parse(data));
    const newNotes = []
    for(let i=0;i<notes.length;i++){
      if(idToDelete !== notes[i].id){
        newNotes.push(notes[i])
      }
    }
    return newNotes
  }).then(function(notes) {
    writeFileAsync('./develop/db/db.json', json.stringify(notes))
    res.send('saved!')
  })
})

// GET Route for html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/index.html'))
);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/notes.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);