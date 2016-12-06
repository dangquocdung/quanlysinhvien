var express = require("express");
var app = express();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'sinhvien', //env var: PGDATABASE
  password: 's01awind5', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

app.listen(process.env.PORT || 3002);

app.get("/",function(req, res){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM sinhvien', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }

      //output: 1
      res.render("trangchu",{danhsach: result});
    });
  });
});

app.get("/them",function(req, res){

  res.render("them");
});

app.post("/them",urlencodedParser,function(req, res){
  var hoten = req.body.txtHoTen;
  var email = req.body.txtEmail;

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO sinhvien("Hoten", "Email") VALUES ($1,$2)',[hoten, email], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }

      //output: 1
      res.redirect("/");
    });
  });


});

app.get("/sua/:id",function (req, res) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;

    client.query('SELECT * FROM sinhvien WHERE id=$1',[id], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }

      //output: 1
      res.render("sua", {sv: result.rows[0]});

    });
  });

});

app.post("/sua", urlencodedParser, function(req, res){
  var hoten = req.body.txtHoTen;
  var email = req.body.txtEmail;
  var id = req.body.txtId;

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('UPDATE sinhvien SET "Hoten"=$1, "Email"=$2 WHERE "id"=$3',[hoten, email, id], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }

      //output: 1
      res.redirect("/");
    });
  });


});

app.get("/xoa/:id",function(req, res){

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      var id = req.params.id;

      client.query('DELETE FROM sinhvien WHERE id=$1',[id], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          res.end();
          return console.error('error running query', err);
        }

        //output: 1
        res.redirect("/");

      });
    });




});
