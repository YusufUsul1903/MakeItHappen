const $ = id => document.getElementById(id);

let selectedCategoryColor = '#3B6D11';

async function addTask() {
    const input = $('taskInput');
    const categorySelect = $('taskCategory');

    const title = input.value.trim();
    const category = categorySelect?.value || null;

    if (!title) {
        input.focus();
        return;
    }

    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    input.value = '';
    if (categorySelect) categorySelect.value = '';

    addTaskToDOM(data.task);
}

function addTaskToDOM(task) {
    const list = $('taskList');
    const empty = list.querySelector('.empty-state');

    if (empty) empty.remove();

    const li = document.createElement('li');

    li.dataset.id = task._id;
    li.className = task.completed ? 'completed' : '';

    const categoryLabel = task.category
        ? `
            <small class="task-category-label">
                <span class="cat-dot" style="background:${task.category.color}"></span>
                ${escapeHTML(task.category.name)}
            </small>
        `
        : '';

    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>

            <div>
                <span>${escapeHTML(task.title)}</span>
                ${categoryLabel}
            </div>
        </div>

        <div class="task-actions">
            <button 
                class="btn-edit" 
                data-id="${task._id}" 
                data-title="${escapeHTML(task.title)}"
                data-category="${task.category ? task.category._id : ''}"
            >
                ✏️
            </button>

            <button class="btn-delete" data-id="${task._id}">🗑️</button>
        </div>
    `;

    bindTaskEvents(li);
    list.prepend(li);
}

function bindTaskEvents(li) {
    li.querySelector('input[type="checkbox"]')?.addEventListener('change', toggleTask);
    li.querySelector('.btn-edit')?.addEventListener('click', openEditModal);
    li.querySelector('.btn-delete')?.addEventListener('click', deleteTask);
}

async function toggleTask(e) {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    const completed = e.target.checked;

    const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        e.target.checked = !completed;
        return;
    }

    li.classList.toggle('completed', completed);
}

async function deleteTask(e) {
    const li = e.target.closest('li');
    const id = li.dataset.id;

    const confirmed = confirm('Ben je zeker dat je deze taak wil verwijderen?');

    if (!confirmed) return;

    const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    li.remove();

    if (!$('taskList').querySelector('li')) {
        $('taskList').innerHTML = '<p class="empty-state">Geen taken gevonden. Lekker bezig!</p>';
    }
}

function openEditModal(e) {
    const btn = e.target.closest('.btn-edit');

    $('editTaskId').value = btn.dataset.id;
    $('editTaskTitle').value = btn.dataset.title;
    $('editTaskCategory').value = btn.dataset.category || '';

    $('editModal').style.display = 'flex';
    $('editTaskTitle').focus();
}

async function saveEdit() {
    const id = $('editTaskId').value;
    const title = $('editTaskTitle').value.trim();
    const category = $('editTaskCategory').value || null;

    if (!title) {
        $('editTaskTitle').focus();
        return;
    }

    const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    location.reload();
}

function closeModal() {
    $('editModal').style.display = 'none';
}

function toggleCategoryForm() {
    $('addCategoryForm').style.display = 'flex';
    $('newCategoryName').focus();
}

function closeCategoryForm() {
    $('addCategoryForm').style.display = 'none';
    $('newCategoryName').value = '';
    selectedCategoryColor = '#3B6D11';

    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.classList.remove('selected');
    });
}

async function saveCategory() {
    const name = $('newCategoryName').value.trim();

    if (!name) {
        $('newCategoryName').focus();
        return;
    }

    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            color: selectedCategoryColor
        })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    location.reload();
}

async function deleteCategory(e) {
    const id = e.target.dataset.id;

    const confirmed = confirm('Ben je zeker dat je deze categorie wil verwijderen? Taken blijven bestaan, maar zonder categorie.');

    if (!confirmed) return;

    const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    location.href = '/';
}

function escapeHTML(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

$('addTaskBtn')?.addEventListener('click', addTask);

$('taskInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

$('saveEdit')?.addEventListener('click', saveEdit);
$('cancelEdit')?.addEventListener('click', closeModal);
$('closeModal')?.addEventListener('click', closeModal);

$('editTaskTitle')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveEdit();
});

$('toggleAddCategory')?.addEventListener('click', toggleCategoryForm);
$('cancelCategoryBtn')?.addEventListener('click', closeCategoryForm);
$('saveCategoryBtn')?.addEventListener('click', saveCategory);

$('newCategoryName')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveCategory();
});

document.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCategoryColor = btn.dataset.color;

        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
        });

        btn.classList.add('selected');
    });
});

document.querySelectorAll('.btn-cat-delete').forEach(btn => {
    btn.addEventListener('click', deleteCategory);
});

document.querySelectorAll('#taskList li').forEach(bindTaskEvents);