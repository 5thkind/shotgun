var express = require("express");
var router = express.Router();
const request = require("request");
const config = require("../user_config.js");

const shotgun_url = config.shotgun_url;

router.all("/", async (req, res, next) => {
  res.send("shotgun");
});

router.post("/login", function(req, res, next) {
  const post_data = {
    grant_type: "client_credentials",
    client_id: config.shotgun_script_name,
    client_secret: config.shotgun_script_key
  };
  let formBody = [];
  for (let property in post_data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(post_data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const proxyOptions = {
    url: shotgun_url + "/api/v1/auth/access_token",
    rejectUnauthorized: false,
    method: "POST",
    body: formBody
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.get("/entity", function(req, res, next) {
  const id = req.query.id;
  const entity_type = req.query.type;
  const proxyOptions = {
    url:
      shotgun_url +
      "/api/v1/entity/" +
      entity_type +
      "?filter[id]=" +
      id +
      "&fields=*",
    rejectUnauthorized: false,
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

module.exports = router;
