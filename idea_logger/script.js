const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const tagsInput = document.getElementById('tags');
const saveButton = document.getElementById('save-button');
const ideaList = document.getElementById('idea-list');
const filterInput = document.getElementById('filter');

// Load saved ideas from localStorage
function loadIdeas() {
    const data = localStorage.getItem('ideas');
    return data ? JSON.parse(data) : [];
}

function saveIdeas(ideas) {
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

function renderIdeas(ideas) {
    ideaList.innerHTML = '';
    const filter = filterInput.value.trim().toLowerCase();
    ideas.forEach((idea, index) => {
        if (filter && !idea.tags.some(tag => tag.toLowerCase().includes(filter))) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = `<strong>${idea.title}</strong> - ${idea.content} <em>(${idea.tags.join(', ')})</em>`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Delete';
        removeBtn.addEventListener('click', () => {
            ideas.splice(index, 1);
            saveIdeas(ideas);
            renderIdeas(ideas);
        });
        li.appendChild(removeBtn);
        ideaList.appendChild(li);
    });
}

saveButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    if (!title && !content) return;
    const ideas = loadIdeas();
    ideas.push({ title, content, tags });
    saveIdeas(ideas);
    titleInput.value = '';
    contentInput.value = '';
    tagsInput.value = '';
    renderIdeas(ideas);
});

filterInput.addEventListener('input', () => {
    renderIdeas(loadIdeas());
});

// Initial render
renderIdeas(loadIdeas());
