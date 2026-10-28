(function () {
  'use strict';

  const STORAGE_KEY = 'todo-app-tasks';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');
  const counter = document.getElementById('counter');
  const clearDoneBtn = document.getElementById('clear-done');

  let tasks = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('No se pudieron leer las tareas guardadas:', err);
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('No se pudieron guardar las tareas:', err);
    }
  }

  function render() {
    list.innerHTML = '';

    tasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'task-' + task.id;
      checkbox.checked = task.done;
      checkbox.addEventListener('change', function () {
        task.done = checkbox.checked;
        save();
        render();
      });

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = task.text;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'delete-btn';
      delBtn.setAttribute('aria-label', 'Eliminar tarea: ' + task.text);
      delBtn.textContent = '×';
      delBtn.addEventListener('click', function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        save();
        render();
      });

      li.append(checkbox, label, delBtn);
      list.appendChild(li);
    });

    emptyMsg.hidden = tasks.length > 0;
    const pending = tasks.filter(function (t) { return !t.done; }).length;
    counter.textContent = pending + ' pendiente' + (pending === 1 ? '' : 's');
    clearDoneBtn.disabled = tasks.every(function (t) { return !t.done; });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: text,
      done: false
    });
    input.value = '';
    save();
    render();
    input.focus();
  });

  clearDoneBtn.addEventListener('click', function () {
    tasks = tasks.filter(function (t) { return !t.done; });
    save();
    render();
  });

  render();
})();
