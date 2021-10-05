import {getDatabase, ref, get, child, set} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import {insertAfter} from "./utils.js";

const DB = getDatabase()

const inputs = {}

document.getElementById('inp-login').onchange = (ev) => {
    inputs['login'] = ev.target.value;
}
document.getElementById('inp-password').onchange = (ev) => {
    inputs['password'] = ev.target.value;
}
document.getElementById('auth').onclick = (ev) => {
    checkUserExisting(inputs['login']);
}

function warningUserNotExisting(userId) {
    let node = document.createTextNode("Пользователь не существует");
    insertAfter(node, document.getElementById('inp-login'));
    setTimeout(() => {
        node.remove();
    }, 3000)
}

function warningPasswordIsWrong() {
    let node = document.createTextNode("Пароль неверный");
    insertAfter(node, document.getElementById('inp-password'));
    setTimeout(() => {
        node.remove();
    }, 3000)
}

function checkUserExisting(userId) {
    const dbRef = ref(DB);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            if (inputs['password'] !== data['password']) {
                warningPasswordIsWrong();
            } else {
                document.cookie = "user=" + inputs['login'];
                window.location.href = './index.html';
            }
        } else {
            warningUserNotExisting(userId);
        }
    }).catch((error) => {
        console.error(error);
    });
}