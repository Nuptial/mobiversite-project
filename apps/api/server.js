require("dotenv").config();
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const path = require("path");

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));

app.use(
  cors({
    origin: [/^http:\/\/localhost:3000$/, /\.vercel\.app$/],
    credentials: true,
  })
);

app.use(jsonServer.defaults());
app.db = router.db;
app.use(auth);
app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`JSON Server on http://localhost:${port}`));
