const path = require('path');
const express = require('express');
const hbs = require('hbs');
const { load_messages, write_message } = require('./notes');
const app = express();
//Comentário de teste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { port } = require('../config/constants').server

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(publicDirectoryPath, './uploads'))
  },
  filename: function (req, file, cb) {
    const extensaoArquivo = file.originalname.split('.')[1];
    cb(null, Date.now() + '.' + extensaoArquivo);
  }
});


// template engine configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//static assets configuration
app.use(express.static(publicDirectoryPath))


// endpoints

app.get('/include', (req, res) => {
  res.render('include');
})

app.get('', (req, res) => {
  const messages = load_messages();
  res.render('index', { messages: messages });
})


app.post('/include', multer({ storage }).single('foto'), (req, res) => {
  const { nome, recado } = req.body;

  if (!nome || !recado) {
    return res.render('/include');
  }

  const caminho_imagem = 'uploads/' + req.file.filename;

  write_message(nome, caminho_imagem, recado);

  const messages = load_messages();
  res.render('index', { messages: messages });
})


app.listen(port, () => {
  console.log(`🚀 Starting app on port ${port}...`)
})
