import {getDatabase, ref, get, child, set} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import {getCookie, insertAfter} from "./utils.js";

const DB = getDatabase()

const inputs = {}

const states = {
    'passwordDuplicate': false,
    'isLoginOk': false,
}

document.getElementById('inp-login').onchange = (ev) => {
    inputs['login'] = ev.target.value;
    checkUserExisting(ev.target.value);
}
document.getElementById('inp-password1').onchange = (ev) => {
    inputs['password1'] = ev.target.value;
    checkWarningPasswordDuplicate(inputs['password1'], inputs['password2']);
}
document.getElementById('inp-password2').onchange = (ev) => {
    inputs['password2'] = ev.target.value;
    checkWarningPasswordDuplicate(inputs['password1'], inputs['password2']);
}
document.getElementById('inp-answer').onchange = (ev) => {
    inputs['answer'] = ev.target.value;
}
document.getElementById('create-account').onclick = registerUser;


if (getCookie('user') !== undefined) {
    window.location.href = './index.html';
}

function warningUserExisting(userId) {
    let node = document.createTextNode('Пользователь с логином ' + userId + ' уже существует');
    insertAfter(node, document.getElementById('inp-login'));
    setTimeout(() => {
        node.remove();
    }, 3000)
}

function checkWarningPasswordDuplicate(p1, p2) {
    if (p1 !== p2 && !states["passwordDuplicate"]) {
        let node = document.createTextNode('Пароли не совпадают');
        insertAfter(node, document.getElementById('inp-password2'));
        states['passwordDuplicate'] = true;
        setTimeout(() => {
            node.remove();
            states['passwordDuplicate'] = false;
        }, 3000)
    }
}

function checkUserExisting(userId) {
    const dbRef = ref(DB);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            warningUserExisting(userId);
            states['isLoginOk'] = false;
        } else {
            states['isLoginOk'] = true;
        }
    }).catch((error) => {
        console.error(error);
    });
}

function registerUser() {
    if (inputs['password1'] === inputs['password2'] && states['isLoginOk']) {
        set(ref(DB, 'users/' + inputs['login']),
            {
                password: inputs['password1'],
                question: document.getElementById('question').options[document.getElementById('question').selectedIndex].text,
                answer: inputs['answer'],
            });
        document.cookie = "user=" + inputs['login'];
        document.location.href = './index.html';
    } else {
        checkWarningPasswordDuplicate(inputs['password1'], inputs['password2']);
        checkUserExisting(inputs['login']);
    }
}