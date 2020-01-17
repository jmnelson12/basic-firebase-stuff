// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "<api-key>",
    authDomain: "basic-contact.firebaseapp.com",
    databaseURL: "https://basic-contact.firebaseio.com",
    projectId: "basic-contact",
    storageBucket: "basic-contact.appspot.com",
    messagingSenderId: "<sender-id>",
    appId: "<app-id>"
};

// Initialize Firebase
firebase.initializeApp(secrets);

// reference messages collection
const messagesRef = firebase.database().ref('messages');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const btnDeleteAll = document.getElementById('btnDeleteAll');
    form.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('txtName').value;
        const message = document.getElementById('txtMessage').value;

        const newMessage = messagesRef.push();
        newMessage.set({ name, message });
    });

    messagesRef.on('value', snapshot => {
        const messages = snapshot.val();
        clearMessageList();

        if (messages) {
            for (let [key, value] of Object.entries(messages)) {
                pushMessageToList({ message: value.message, name: value.name });
            }
        }
    }, errorObject => {
        console.log("The read failed: " + errorObject.code);
    });

    btnDeleteAll.addEventListener('click', deleteAllMesages);
});

function pushMessageToList(messageData) {
    const submittedMessagesEl = document.getElementById('submittedMessages');
    const li = document.createElement('li');

    li.innerHTML = `<p>${messageData.name} says: ${messageData.message}</p>`;

    submittedMessagesEl.appendChild(li);
}

function clearMessageList() {
    const submittedMessagesEl = document.getElementById('submittedMessages');
    submittedMessagesEl.innerHTML = "";
}

function deleteAllMesages() {
    messagesRef.remove(() => {
        clearMessageList();
    });
}