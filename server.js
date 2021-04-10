const express = require('express');
const dotenv = require('dotenv');
require('colors');
const cors = require('cors');
// const todos = require('./db.json');
const { nanoid } = require('nanoid');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/todos', (req, res) => {
   fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) return console.log('error en readFile');
      const dataParsed = JSON.parse(data);
      console.log(typeof dataParsed);
      return res.send(dataParsed);
   });
});

app.post('/todos', (req, res) => {
   const todo = { title: req.body.title, id: nanoid(), completed: false };
   // const upDatedTodos = [...todos, todo];

   // const data = JSON.stringify(upDatedTodos);

   // fs.writeFile('./db.json', data, err => {
   //    if (err) return console.log('Error wirting db', err);
   //    return res.send(todo);

   // });
   fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) return console.log('Error en post method', err);
      const dataParsed = JSON.parse(data);
      const allTodos = [...dataParsed, todo];
      const dataToJson = JSON.stringify(allTodos);

      fs.writeFile('./db.json', dataToJson, err => {
         if (err) return console.log('Error en writeFile', err);
      });
      return res.send(todo);
   });
});

app.patch('/todos/:id', (req, res) => {
   const id = req.params.id;
   const completed = Boolean(req.body.completed);

   fs.readFile('./db.json', { encoding: 'utf-8' }, (err, data) => {
      if (err) return console.log('Error en patch', err);
      const todos = JSON.parse(data);
      const index = todos.findIndex(todo => todo.id === id);

      if (index > -1) {
         todos[index].completed = completed;
         const dataToJson = JSON.stringify(todos);

         fs.writeFile('./db.json', dataToJson, err => {
            if (err) return console.log('Error en writeFile', err);
         });
         console.log(todos[index].completed);
      }
      return res.send(todos[index]);
   });
});

app.delete('/todos/:id', (req, res) => {
   const id = req.params.id;

   fs.readFile('./db.json', { encoding: 'utf-8' }, (err, data) => {
      if (err) return console.log('Error en delete method', err);
      const todos = JSON.parse(data);
      const index = todos.findIndex(todo => todo.id === id);
      if (index > -1) {
         todos.splice(index, 1);
         const dataParsed = JSON.stringify(todos);
         fs.writeFile('./db.json', dataParsed, err => {
            if (err) return console.log(err);
         });
      }

      res.send(todos);
   });
});

const PORT = 7000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));
