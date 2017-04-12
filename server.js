// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

// require all schemas and models, passed from the index file and related files
var db = require('./models')

// access a single book by using db.Books as the root




////////////////////
//  DATA
////////////////////






////////////////////
//  ROUTES
////////////////////


// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});


// get all books
// ✓ REFACTORED 

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    // populate fills in the author id with all the author data
    .populate('author')
    .exec(function(err, books){
      if (err) { return console.log("index error: " + err); }
      res.json(books);
    });
});

// get one book
// ✓ REFACTORED

app.get('/api/books/:id', function (req, res) {
  
  console.log('books show', req.params);

  // find one book by its id
  db.Book.findOne({_id: req.params.id}, function(err, data){

    // add error function
    if (err) { 
      console.log("index error: " + err); 
      res.sendStatus(500);
    } else {
    // return the data from the findOne function  
    res.json(data);
    }

  });

});

// create new book
// ✓ REFACTORED

app.post('/api/books', function (req, res) {
  
  // check received books
  console.log('books create', req.body);
  
  // create a new book in the database
  var newBook = new db.Book(req.body);
  newBook.save(function(err, savedBook){

    // add error function
    if (err) { 
      console.log("index error: " + err); 
      res.sendStatus(500);
    } else {

      // Send the data back to app.js to create an entry using AJAX.
      res.json(savedBook);

    }

  });

});

// update book
// x REFACTORED

app.put('/api/books/:id', function(req,res){

// get book id from url params (`req.params`)
  console.log('books update', req.params);

  var bookId = req.params.id;
  // find the index of the book we want to remove

  db.Book.findOne({ _id: bookId }, function (err, edittedBook) {
    console.log(edittedBook)

    // res.json(edittedBook);
  });





  // var updateBookIndex = books.findIndex(function(element, index) {
  //   return (element._id === parseInt(req.params.id)); //params are strings
  // });
  // console.log('updating book with index', deleteBookIndex);
  // var bookToUpdate = books[deleteBookIndex];
  // books.splice(updateBookIndex, 1, req.params);
  // res.json(req.params);
});

// delete book
// ✓ REFACTORED

app.delete('/api/books/:id', function (req, res) {
  
  // check the parameters
  console.log('books delete', req.params);

  // get the id from the delete button click
  var bookId = req.params.id;

  // find and remove the selected book
  db.Book.findOneAndRemove({ _id: bookId }, function (err, deleteBook) {
    res.json(deleteBook);
  });
});




////////////////////
//  SERVER PORT
////////////////////

app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
