var express = require("express");
var app = express();
const redis = require("redis")
// const redisPort = 6379
//TODO: create a redis client
const redisClient = redis.createClient()


redisClient.on("error", function (err) {
  console.log("Error encountered", err)
})


redisClient.on("connect", function (err) {
  console.log("redis connection established")
})


// serve static files from public directory
app.use(express.static("public"));

// TODO: initialize values for: header, left, right, article and footer using the redis client
redisClient.set("header", 0)
redisClient.set("left", 0)
redisClient.set("right", 0)
redisClient.set("article", 0)
redisClient.set("footer", 0)





// Get values for holy grail layout
function data() {
  // TODO: uses Promise to get the values for header, left, right, article and footer from Redis
  return new Promise((resolve, reject) => {
    redisClient.mget(["header", "left", "right", "article", "footer"], function (err, data) {
      const resultJSON = {
        header: data[0],
        left: data[1],
        right: data[2],
        article: data[3],
        footer: data[4]
      }
      if (data !== null) {
        resolve(resultJSON)
      } else {
        reject("err")
      }
    })

  })


}

// plus
app.get("/update/:key/:value", function (req, res) {
  const key = req.params.key;
  let value = Number(req.params.value);
  //TODO: use the redis client to update the value associated with the given key
    redisClient.set(key,value, function (err, response) {
      if (response !== null) {
        data().then((d) => {
          res.send(d);
        });
      } else {
        reject("err")
      }
    })
});

// get key data
app.get("/data", function (req, res) {
  data().then((data) => {
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log("Running on 3000");
});

process.on("exit", function () {
  client.quit();
});
