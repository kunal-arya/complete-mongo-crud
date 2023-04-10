const { MongoClient } = require("mongodb");

let dbConnection;

const password = "vgHJ9Gl3uZ8f7joj";

const uri = `mongodb+srv://kunal_arya:${password}@cluster0.x1qa2ut.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
