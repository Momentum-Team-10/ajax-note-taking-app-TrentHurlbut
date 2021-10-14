const url = 'http://localhost:3000/notes';

//The UL in HTML that will hold all the notes you add ('li' elements)
const noteList = document.getElementById('note-list');

//The form element which wraps the entry field.
const form = document.querySelector('#note-form');

//The function which enacts a removal or edit of a JSON object in the local database after hitting the delete icon.
noteList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        deleteNote(e.target);
    }

    if (e.target.classList.contains('edit')) {
        console.log('editing note');
    }
});

//The function which listens for the 'submit' button in the form which adds a new JSON object and posts the note.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteText = document.getElementById('note-text').value;
    createNote(noteText);
    form.reset();
});

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

//Note creation function which provides styling for how each note is created.
function renderNoteItem(noteObj) {
    const li = document.createElement('li');
    li.id = noteObj.id;
    li.classList.add(
        'lh-copy',
        'pv3',
        'ba',
        'bl-0',
        'bt-0',
        'br-0',
        'b--dotted',
        'b--black-3'
    );
    renderNoteText(li, noteObj);
    noteList.appendChild(li);
}

//This is how the text of the note is created and the actual imputing of the HTML element.
function renderNoteText(li, noteObj) {
    li.innerHTML = `<span class='dib w-60'>${noteObj.body}</span>${
        noteObj.updated_at
            ? moment(noteObj.updated_at).format('MMM DD, YYYY')
            : ''
    }
    <i class="ml2 dark-red fas fa-times delete"></i><i class="ml3 fas fa-edit edit"></i>`;
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

//This delete function is called when the delete icon is clicked in the above eventListener.
function deleteNote(noteEl) {
    fetch(url + '/' + `${noteEl.id}`, {
        method: 'DELETE',
    }).then(() => noteEl.parentElement.remove());
}

function updateNote(noteEl) {
    const noteText = document.getElementById('note-text').value;
    fetch(url + '/' + `${noteEl.parentElement.id}`, {
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
            renderNoteText(noteEl.parentElement, data);
        });
}

//The actual listNotes() function call which displays all stored notes on the page.
listNotes();
