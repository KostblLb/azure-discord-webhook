var https = require("https");
var express = require("express");
var app = express();
var md5 = require("md5");
var whStorage = require("./whStorage");
var PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  var whRegex = /(\d+)\/([\w\d]+)\/?$/;
  var whAddress = req.query["q"];
  if (!whAddress) {
    res.status(400);
    res.end(`Send a GET request with Discord webhook address as query parameter q.\n
For example, "/?q=https://discordapp.com/api/webhooks/728789913434980374/DIUrFtsKzpHePKP895wnIK6lSbTaBIhn6xQaaL48e9E8gP5ZEpNesTQGeLRuXvrMNRUd"
`);
    return;
  }

  var whParts = whRegex.exec(whAddress);
  if (whParts.length !== 3) {
    res.status(400);
    res.end(
      "Discord webhook address must have format of '.../<webhook id>/<webhook token>'"
    );
    return;
  }

  var [whId, whToken] = [whParts[1].trim(), whParts[2].trim()];
  var hash = md5("randomseed12e98u3498u23498u" + whId + whToken);

  var searchResult = ((await whStorage.get(hash)) || {}).hash;
  if (!searchResult) {
    res.end(await whStorage.set(hash, whId, whToken));
  } else res.end(searchResult);
});

app.delete("/:id", async (req, res) => {
  var hash = req.params["id"];
  try {
    await whStorage.delete(hash);
  } catch {
    res.status(404);
    res.end(`Discord endpoint with id ${hash} not found`);
    return;
  }
  res.end();
});

app.use(express.json()).post("/:id", async (req, res) => {
  var hash = req.params["id"];
  if (!hash) {
    res
      .status(400)
      .send(
        `Send a POST request with Discord endpoint id acquired from sending GET`
      );
    return;
  }

  var wh = await whStorage.get(hash);
  if (!wh) {
    res.status(404).send(`Discord endpoint with id ${hash} not found`);
    return;
  }

  var text, url;
  try {
    var {
      message: { text },
      resource: { url },
    } = req.body;
  } catch {
    res.status(400);
    res.end(
      "Request body must conform to { 'message': { 'text' : <string> }, 'resource': { 'url': <string> } }"
    );
    return;
  }

  var discordRequest = https.request(
    {
      method: "POST",
      host: "discordapp.com",
      path: `/api/webhooks/${wh.id}/${wh.token.trim()}`,
    },
    (discordRes) => {
      res.status(discordRes.statusCode);

      discordRes.setEncoding("utf8");
      discordRes.on("data", (chunk) => {
        console.log("Discord Response: " + chunk);
        res.write(chunk);
      });
      discordRes.on("end", () => {
        res.end();
      });
    }
  );
  discordRequest.setHeader("Content-Type", "application/json");
  discordRequest.write(
    JSON.stringify({
      content: `${text} \r\n ${url}`,
    })
  );
  discordRequest.end();
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
