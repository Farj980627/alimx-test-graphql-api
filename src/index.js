const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

const schema = buildSchema(
  `
    type User {
    name: String, secondName: String, fatherSurname: String, motherSurname: String, bornDate: String, email: String, cellphone: String
  }
    type Query {
    getUsers: [User]    
  } 
    type Mutation {    
    createData(name: String, secondName: String, fatherSurname: String, motherSurname: String, bornDate: String, email: String, cellphone: String) : Boolean   
  }
`
);



const queryDB = (req, sql, args) =>
  new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      rows.changedRows || rows.affectedRows || rows.insertId
        ? resolve(true)
        : resolve(rows);
    });
  });

const root = {
  getData: (args, req) =>
    queryDB(req, "select * from users_test_jesusabisaifavela").then(
      (data) => data
    ),
  createData: (args, req) =>
    queryDB(req, "insert into users_test_jesusabisaifavela SET ?", args).then(
      (data) => {
        console.log(data);
      }
    ),
};

app.use((req, res, next) => {
  req.mysqlDb = mysql.createConnection({
    host: "data-avimo.cgriqmyweq5c.us-east-2.rds.amazonaws.com",
    user: "testing",
    password: "Pruebas%ALI%2020",
    database: "testing_ali_fullstack",
    multipleStatements: true,
  });
  req.mysqlDb.connect();
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);

console.log("Running a GraphQL API server at localhost:4000/graphql");

