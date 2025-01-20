import bodyParser from "body-parser";
import express from "express";
import fs from "fs/promises";

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

async function getTodos() {
  const todos = await fs.readFile("todos.json", "utf-8");
  const parsedTodos = JSON.parse(todos);
  return parsedTodos.todos;
}

async function updateTodos(newTodos) {
  const newTodosObj = { todos: newTodos };
  const newTodosStr = JSON.stringify(newTodosObj, null, 2);
  await fs.writeFile("todos.json", newTodosStr);
  return newTodos;
}

app.get("/", async (req, res) => {
  // HTML File
  res.setHeader("Content-Type", "text/html");
  res.render("index", { todos: await getTodos() });
});

app.post("/todos", async (req, res) => {
  // récupérer le body qui est un form data ?

  const newTodos = [
    ...(await getTodos()),
    {
      text: req.body.todo,
      completed: false,
      id: Date.now(),
    },
  ];
  updateTodos(newTodos);
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

  const todos = await getTodos();
  const newTodos = todos.map((todo) => {
    if (todo.id === Number(todoId)) {
      return {
        ...todo,
        completed: body.completed,
      };
    }
    return todo;
  });

  updateTodos(newTodos);

  res.status(200);
  res.send("ok");
});

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;

  const todos = await getTodos();
  const newTodos = todos.filter((todo) => todo.id !== Number(todoId));
  updateTodos(newTodos);

  res.status(200);
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
