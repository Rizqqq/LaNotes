// App State mapping users to their notes
let appData = JSON.parse(localStorage.getItem('laNotaData')) || {};
let currentUser = null;

// DOM Elements
const userView = document.getElementById('user-view');
const notesView = document.getElementById('notes-view');
const userList = document.getElementById('user-list');
const notesList = document.getElementById('notes-list');

const newUserInput = document.getElementById('new-user-input');
const addUserBtn = document.getElementById('add-user-btn');

const newNoteInput = document.getElementById('new-note-input');
const addNoteBtn = document.getElementById('add-note-btn');
const backBtn = document.getElementById('back-btn');
const currentUserTitle = document.getElementById('current-user-title');

// Initialize App
function init() {
    renderUsers();
}

// Save to LocalStorage
function saveData() {
    localStorage.setItem('laNotaData', JSON.stringify(appData));
}

// User Management
addUserBtn.addEventListener('click', () => {
    const userName = newUserInput.value.trim();
    if (userName === '') return alert('Please enter a name!');
    
    // Add user if they don't exist
    if (!appData[userName]) {
        appData[userName] = [];
        saveData();
    }
    
    newUserInput.value = '';
    renderUsers();
});

// Render the list of users
function renderUsers() {
    userList.innerHTML = '';
    const users = Object.keys(appData);
    
    if (users.length === 0) {
        userList.innerHTML = '<p style="opacity:0.7">No users yet. Create one above!</p>';
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<span>👤 ${user}</span> <small>${appData[user].length} note(s)</small>`;
        li.addEventListener('click', () => openUserNotes(user));
        userList.appendChild(li);
    });
}

// Switch Views with smooth animation
function switchView(hideView, showView) {
    hideView.classList.remove('active');
    setTimeout(() => {
        showView.classList.add('active');
    }, 250); // slight delay to wait for opacity transition
}

// Open Notes for a specific user
function openUserNotes(user) {
    currentUser = user;
    currentUserTitle.innerText = `${user}'s Notes`;
    renderNotes();
    switchView(userView, notesView);
}

// Go back to user list
backBtn.addEventListener('click', () => {
    currentUser = null;
    renderUsers();
    switchView(notesView, userView);
});

// Note Management
addNoteBtn.addEventListener('click', () => {
    const noteText = newNoteInput.value.trim();
    if (noteText === '') return alert('Cannot save an empty note!');
    
    const newNote = {
        text: noteText,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };

    appData[currentUser].push(newNote);
    saveData();
    
    newNoteInput.value = '';
    renderNotes();
});

// Render notes for the current user
function renderNotes() {
    notesList.innerHTML = '';
    const notes = appData[currentUser];
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p style="opacity:0.7">No notes yet. Start writing!</p>';
        return;
    }

    // Render in reverse so newest notes are on top
    [...notes].reverse().forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.innerHTML = `
            <div>${note.text}</div>
            <span class="note-date">${note.date}</span>
        `;
        notesList.appendChild(div);
    });
}

// Run init on load
init();