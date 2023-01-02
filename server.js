var http = require("http");
var fs = require("fs");

const PORT = 8080;
app.use(express.static(path.join(__dirname, "public")));

fs.readFile("./index.html", function (error, html) {
  if (error) throw error;
  http
    .createServer(function (req, res) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    })
    .listen(PORT);
});
