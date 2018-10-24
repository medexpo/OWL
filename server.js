const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello from express" });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle react routing return all requests to react app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log("Listening on port ${port}"));
