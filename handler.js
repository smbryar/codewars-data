const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql");

const app = express();
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "codewars"
})

module.exports.updateDatabase = () => {
  const queryPost = "INSERT INTO smbryar (time, honor) VALUES (NOW(), ?);";
  const querySelect = "SELECT * FROM smbryar WHERE id = ?"

  axios
    .get("https://www.codewars.com/api/v1/users/smbryar")
    .then(response => {
      console.log(response.data);
      const honorValue = response.data.honor;

      connection.query(queryPost, honorValue, function (error, data) {
        if (error) {
          console.log("Error adding honor", error);
          res.status(500).json({
            error: error
          })
        }
        else {
          connection.query(querySelect, [data.insertId], function (error, data) {
            if (error) {
              console.log("Error selecting new honor", error);
              res.status(500).json({
                error: error
              })
            }
            else {
              res.status(201).json({
                newHonor: data
              })
            }
          })
        }
      })
    })
    .catch(err => {
      console.log("Could not update data", err);
    });
};

app.get("/honorDatabase", function (req, res) {
  const queryGet = "SELECT * FROM smbryar;";
  connection.query(queryGet, function (error, data) {
    if (error) {
      console.log("Error fetching data", error);
      res.status(500).json({
        error: error
      })
    }
    else {
      res.status(200).json({
        data: data
      })
    }
  });
});

app.delete("/honorDatabase/:id", function (req, res) {
  const idValue = req.params.id;
  const queryDelete = "DELETE FROM smbryar WHERE id = ?;";
  connection.query(queryDelete, idValue, function (error, data) {
    if (error) {
      console.log("Error deleting data", error);
      res.status(500).json({
        error: error
      })
    }
    else {
      res.status(200).json({
        result: "success"
      })
    }
  });
});

module.exports.honorDatabase = serverless(app);