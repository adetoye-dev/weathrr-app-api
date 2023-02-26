import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, from backend");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
