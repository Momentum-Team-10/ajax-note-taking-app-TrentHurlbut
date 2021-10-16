//VARIABLE DECLARATION
//fetech() url as a variable for convenience.
const url = 'http://localhost:3000/notes';

//The UL in HTML that will hold all the notes you add ('li' elements).
const noteList = document.getElementById('note-list');

//The form element which wraps the entry field.
const form = document.querySelector('#note-form');

//The initial rendering of all stored JSON notes on the page.
function listNotes() {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            for (let item of data) {
                renderNoteItem(item);
            }
        });
}

//FUNCTION DEFINITIONS
//Note creation function which provides styling for how each note is created.
function renderNoteItem(noteObj) {
    const li = document.createElement('li');
    li.id = noteObj.id;
    li.classList.add(
        'message',
        'is-warning',
        'box',
        'container',
        'level',
        'is-flex-wrap-wrap',
        'is-flex-grow-1'
    );
    renderNoteText(li, noteObj);
    noteList.appendChild(li);
}

//This is how the text of the note is created and the actual imputing of the HTML element.
function renderNoteText(li, noteObj) {
    li.innerHTML = `<div class='level-left'>
    <p class='message-body is-flex-wrap-wrap' style='max-width: 1100px;'>${
        noteObj.body
    } </p>${
        noteObj.updated_at
            ? 'Edited: ' + moment(noteObj.updated_at).format('MMM DD, YYYY')
            : ''
    }
    </div>
    <div class='level-right'>
    <i class="fas fa-trash-alt level-item box" style='margin: 0px 5px 0px 0px;'></i><i class="fas fa-pen-nib edit level-item box"></i>
    </div>`;
}

//This is a collection of the above functions when brought together generates a new note after submission.
function createNote(noteText) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: moment().format(),
        }),
    })
        .then((res) => res.json())
        .then((data) => renderNoteItem(data));
}

//This delete function is called when the delete icon is clicked in the below eventListener.
function deleteNote(noteEl) {
    fetch(url + '/' + `${noteEl.parentElement.parentElement.id}`, {
        method: 'DELETE',
    }).then(() => noteEl.parentElement.parentElement.remove());
}

//This is the 'update' function which updates the note when the 'edit' button is clicked in the below eventListener.
function updateNote(noteEl) {
    const noteText = document.getElementById('note-text').value;
    fetch(url + '/' + `${noteEl.parentElement.parentElement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            updated_at: moment().format(),
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            renderNoteText(noteEl.parentElement.parentElement, data);
        });
}

//FUNCTION CALLS
//The actual listNotes() function call which displays all stored notes on the page.
listNotes();

//The function which enacts a removal or edit of a JSON object in the local database after hitting the delete icon.
noteList.addEventListener('click', (e) => {
    const noteText = document.getElementById('note-text').value;

    if (e.target.classList.contains('fa-trash-alt')) {
        deleteNote(e.target);
    }

    if (e.target.classList.contains('edit')) {
        if (noteText !== '') {
            updateNote(e.target);
        }
    }
});

//The function which listens for the 'submit' button in the form which adds a new JSON object and posts the note.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteText = document.getElementById('note-text').value;

    if (noteText !== '') {
        createNote(noteText);
        form.reset();
    }
});
