const firebaseConfig = {
    apiKey: "<api-key>",
    authDomain: "basic-user-auth.firebaseapp.com",
    databaseURL: "https://basic-user-auth.firebaseio.com",
    projectId: "basic-user-auth",
    storageBucket: "basic-user-auth.appspot.com",
    messagingSenderId: "<sender-id>",
    appId: "<app-id>"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const loginFormEl = document.getElementById('loginForm');
    const registerFormEl = document.getElementById('registerForm');

    loginFormEl.addEventListener('submit', submitLoginForm);
    registerFormEl.addEventListener('submit', submitRegisterForm);

    firebase.auth().onAuthStateChanged(function (user) {
        const userDataEl = document.getElementById('userData');

        if (user) {
            // User is signed in.
            var email = user.email;
            var emailVerified = user.emailVerified;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;

            userDataEl.innerHTML = `
                <br>
                <hr>
                <p>email: ${email}</p>
                <p>id: ${uid}</p>
                <p>isAnonymous: ${isAnonymous}</p>
                <p>emailVerified: ${emailVerified}</p>
                <button onclick="logoutUser()">Logout</button>
            `;

            userDataEl.style.display = 'block';

        } else {
            // User is signed out.
            // ...
            userDataEl.innerHTML = "";
            userDataEl.style.display = 'none';
        }
    });
});

function submitLoginForm(e) {
    e.preventDefault();
    const email = document.getElementById('txtLoginEmail').value;
    const password = document.getElementById('txtLoginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log({ error });
        // ...
    });
}

function submitRegisterForm(e) {
    e.preventDefault();

    const email = document.getElementById('txtRegisterEmail').value;
    const password = document.getElementById('txtRegisterPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log({ error });
        // ...
    });
}

function logoutUser() {
    firebase.auth().signOut().catch(function (error) {
        // An error happened. 
        console.error(error);
    });
}
