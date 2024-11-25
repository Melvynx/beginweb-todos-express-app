const ulEl = document.querySelector("#list");

ulEl.addEventListener("click", (e) => {
  // si c'est un checkbox = toggle checkbox
  console.log(e.target);
  if (e.target.type === "checkbox") {
    const liEl = e.target.closest("li");
    const todoId = liEl.getAttribute("data-todoid");
    const checked = e.target.checked;
    console.log({ liEl, todoId, checked });
    updateTodo(todoId, checked);
  }

  if (e.target.nodeName === "BUTTON") {
    const liEl = e.target.closest("li");
    const todoId = liEl.getAttribute("data-todoid");

    deleteTodo(todoId);
  }

  // si c'est un biuton delete = delete
});

async function updateTodo(todoId, checked) {
  // fetch pour mettre à jour !!!
  const res = await fetch(`/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify({
      completed: "",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const inputEl = document.querySelector(
      `li[data-todoid="${todoId}"] > input`
    );
    inputEl.checked = !checked;

    alert("Error while updating");

    return;
  }
}

async function deleteTodo(todoId) {
  const res = await fetch(`/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Error while deleting");
    return;
  }

  const liEl = document.querySelector(`li[data-todoid="${todoId}"]`);

  liEl.remove();
}
