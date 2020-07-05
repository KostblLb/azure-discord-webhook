var https = require("https");
var express = require("express");
var app = express();
var PORT = process.env.PORT || 5000;

app.use(express.json()).post("/", async (req, res) => {
  var whId, whToken;
  try {
    [whId, whToken] = getWebhookParts(req.query["q"]);
  }
  catch {
    res.status(400);
    res.end(`Send a POST request with Discord webhook address as query parameter q.\n
For example, "/?q=https://discordapp.com/api/webhooks/728789913434980374/DIUrFtsKzpHePKP895wnIK6lSbTaBIhn6xQaaL48e9E8gP5ZEpNesTQGeLRuXvrMNRUd"
`);
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
      path: `/api/webhooks/${whId}/${whToken}`,
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
      content: `${text}\r\n${url}`,
    })
  );
  discordRequest.end();
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});

function getWebhookParts(str) {
  var whRegex = /(\d+)\/([\w\d]+)\/?$/;
  var whParts = whRegex.exec(str);
  if (whParts.length !== 3) {
    throw new Error("Discord webhook address must have format of '.../<webhook id>/<webhook token>'");
  }

  return [whParts[1], whParts[2]];
}