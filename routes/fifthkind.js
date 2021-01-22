var express = require("express");
var router = express.Router();
const request = require("request");
const config = require("../user_config.js");
var fs = require("fs");

const meta_url = config.meta_url;
const crs_url = config.crs_url;

router.all("/", async (req, res, next) => {
  res.render("fifthkind", {
    title: "Fifth Kind AMI Publish",
    playlist_id: req.body.ids
  });
});

router.post("/login", function(req, res, next) {
  const sampleData = {
    client_id: config.fifth_kind_client_id,
    grant_type: "password",
    username: config.fifth_kind_username,
    password: config.fifth_kind_password
  };

  const proxyOptions = {
    url: meta_url + "auth/token",
    method: "POST",
    json: sampleData
  };

  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.post("/get_jwt", function(req, res, next) {
  let proxyOptions = {
    url: meta_url + "token",
    method: "POST",
    json: {},
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.post("/get_upload_jwt", function(req, res, next) {
  let proxyOptions = {
    url: crs_url + "token",
    method: "POST",
    json: {},
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.get("/get_domain_tags", function(req, res, next) {
  let proxyOptions = {
    url: meta_url + "tags/domain-purposes",
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.get("/get_tag_groups", function(req, res, next) {
  let proxyOptions = {
    url: meta_url + "tags/groups",
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.get("/get_tag_group_by_id", function(req, res, next) {
  const groupId = req.query.group_id;
  const domainPurpose = req.query.domain_purpose_id;
  const isStructural = req.query.is_structural;
  const isRequired = req.query.is_required;

  let proxyOptions = {
    url:
      meta_url +
      "tags/groups/" +
      groupId +
      "/keys?domain-purpose-id=" +
      domainPurpose +
      "&structural=" +
      isStructural +
      "&required=" +
      isRequired,
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.get("/get_tags_by_selected_id", function(req, res, next) {
  const groupId = req.query.group_id;
  const selectedId = req.query.selected_ids;

  let proxyOptions = {
    url:
      meta_url +
      "tags/keys/" +
      groupId +
      "/values?selected-tag-value-ids=" +
      selectedId,
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.post("/prep_upload_by_file_path", function(req, res, next) {
  const data = req.body;
  let files_for_prep = [];
  let invalid_paths = [];
  let number_of_files = data.length;
  let total_file_size = 0;

  data.forEach(request_file => {
    let file_path = request_file["filepath"];
    if (!fs.existsSync(file_path)) {
      invalid_paths.push(request_file);
    } else {
      file_size = fs.statSync(file_path).size;
      total_file_size += file_size;
      files_for_prep.push({
        fileName: request_file["filename"],
        fileSize: file_size,
        filePath: file_path
      });
    }
  });
  const data_for_5th_kind = {
    transferType: "http",
    files: files_for_prep,
    numFiles: number_of_files,
    fileSize: total_file_size
  };
  let proxyOptions = {
    url: meta_url + "uploads",
    method: "POST",
    json: data_for_5th_kind,
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    invalid_paths.length > 0 ? (body.invalid_paths = invalid_paths) : null;
    res.send(JSON.stringify(body));
  });
});

router.get("/get_upload_token/:numFiles", function(req, res, next) {
  let numFiles = req.params.numFiles;

  let proxyOptions = {
    url: crs_url + "uploads/token/" + `${numFiles}`,
    method: "GET",
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.post("/upload_file_by_path", function(req, res, next) {
  let data = req.body;
  let upload_data = {};
  for (let file_id in data["payload"]) {
    let key = "files[" + file_id + "]";
    upload_data[key] = fs.createReadStream(data["payload"][file_id]);
  }

  let proxyOptions = {
    url:
      crs_url + "uploads/" + `${data["groupId"]}` + "/" + data["uploadToken"],
    method: "POST",
    formData: upload_data,
    headers: { Authorization: req.headers.authorization }
  };

  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

router.put("/add_tags_to_file/:file_id", function(req, res, next) {
  let fileId = req.params.file_id;

  let proxyOptions = {
    url: meta_url + "files/" + fileId + "/tags",
    method: "PUT",
    json: req.body,
    headers: { Authorization: req.headers.authorization }
  };
  request(proxyOptions, (err, response, body) => {
    res.send(JSON.stringify(body));
  });
});

module.exports = router;
