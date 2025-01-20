import bodyParser from "body-parser";
import express from "express";
import { getDB, initDB } from "./db.js";

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database
initDB();

async function getTodos() {
  const db = await getDB();
  const todos = await db.all("SELECT * FROM todos");
  return todos;
}

app.get("/", async (req, res) => {
  // HTML File
  res.setHeader("Content-Type", "text/html");
  res.render("index", { todos: await getTodos() });
});

app.post("/todos", async (req, res) => {
  const db = await getDB();

  await db.run(
    `INSERT INTO todos (text, completed) 
VALUES ($todo, 0);`,
    {
      $todo: req.body.todo,
    }
  );

  res.redirect("/");
});

// REST
app.patch("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const body = req.body;

  if (typeof body.completed !== "boolean") {
    res.status(400);
    res.send("Invalid query");
    return;
  }

  const db = await getDB();
  await db.run(
    `UPDATE todos 
SET completed = $completed 
WHERE id = $id;`,
    {
      $completed: body.completed,
      $id: todoId,
    }
  );

  res.status(200);
  res.send("ok");
});

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;

  const db = await getDB();
  await db.run(
    `DELETE FROM todos
WHERE id = $id`,
    {
      $id: todoId,
    }
  );

  res.status(200);
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
