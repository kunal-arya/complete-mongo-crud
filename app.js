const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");
// init app & middleware
const app = express();
app.use(express.json());

// db Connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log(`app listening on port: 3000`);
    });
    db = getDb();

    // routes
    app.get("/books", (req, res) => {
      // current page
      const page = req.query.p || 0;
      const booksPerPage = 3;

      let books = [];

      db.collection("books")
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage) // to skip the books
        .limit(booksPerPage) // limit the amount of books per page
        .forEach((book) => books.push(book))
        .then(() => {
          res.status(200).json(books);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not fetch the documents" });
        });
    });

    //read
    app.get("/books/:id", (req, res) => {
      const id = req.params.id;

      if (ObjectId.isValid(id)) {
        db.collection("books")
          .findOne({ _id: new ObjectId(id) })
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: "Could not fetch the documents" });
          });
      } else {
        res.status(400).json({ error: "Not a Valid Document Id" });
      }
    });

    // create
    app.post("/books", (req, res) => {
      const book = req.body;

      db.collection("books")
        .insertOne(book)
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(500).json({ err: "could not create a new document" });
        });
    });

    // delete
    app.delete("/books/:id", (req, res) => {
      const id = req.params.id;

      if (ObjectId.isValid(id)) {
        db.collection("books")
          .deleteOne({ _id: new ObjectId(id) })
          .then((result) => {
            res.status(204).json(result);
          })
          .catch((err) => {
            res.status(500).json({ error: "Could not delete the document" });
          });
      } else {
        res.status(400).json({ error: "Not a valid doc id" });
      }
    });

    //update
    app.patch("/books/:id", (req, res) => {
      const updates = req.body;
      const id = req.params.id;

      if (ObjectId.isValid(id)) {
        db.collection("books")
          .updateOne({ _id: new ObjectId(id) }, { $set: updates })
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            res.status(500).json({ error: "Could not update the document" });
          });
      } else {
        res.status(400).json({ error: "Not a valid doc id" });
      }
    });
  } else {
    console.log(err);
  }
});
