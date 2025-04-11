export function addTodo(task, date) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push({ task, date });
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

export function renderTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(({ task, date }, i) => {
    const li = document.createElement('li');
    li.textContent = `${task}${date ? ` (Due: ${date})` : ''}`;
    li.classList.add('flex', 'justify-between', 'items-center');
    const del = document.createElement('button');
    del.textContent = '❌';
    del.className = 'ml-2 text-red-500 hover:text-red-700';
    del.onclick = () => {
      todos.splice(i, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    };
    li.appendChild(del);
    list.appendChild(li);
  });
}
