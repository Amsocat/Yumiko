import {getDatabase, ref, get, child, set} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import {getCookie, insertAfter} from "./utils.js";

const DB = getDatabase();

const states = {
    'passwordDuplicate': false,
    'isLoginOk': false,
    'answerIsWrong': false,
    'trueAnswer': null,
}

const inputs = {};

document.getElementById('inp-login').onchange = (ev) => {
    inputs['login'] = ev.target.value;
    actualQuestion(ev.target.value);
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
document.getElementById('change').onclick = changePassword;

function actualQuestion(userId) {
    const dbRef = ref(DB);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let node = document.getElementById('question');
            let data = snapshot.val()
            states['trueAnswer'] = data['answer'];
            node.innerText = data['question'];
            node.hidden = false;
            states['isLoginOk'] = true;
        } else {
            states['trueAnswer'] = null;
            states['isLoginOk'] = false;
            document.getElementById('question').hidden = true;
            warningUserExisting(userId);
        }
    }).catch((error) => {
        console.error(error);
    });
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

function warningUserExisting(userId) {
    let node = document.createTextNode('Пользователь не существует');
    insertAfter(node, document.getElementById('inp-login'));
    setTimeout(() => {
        node.remove();
    }, 3000)
}

function warningAnswerIsWrong() {
    if (inputs['answer'] !== states['trueAnswer'] && !states['answerIsWrong']) {
        let node = document.createTextNode('Ответ на секретный вопрос неверный');
        insertAfter(node, document.getElementById('inp-answer'));
        states['answerIsWrong'] = true;
        setTimeout(() => {
            states['answerIsWrong'] = false;
            node.remove();
        }, 3000)
    }
}

function changePassword() {
    if (inputs['password1'] === inputs['password2'] && states['isLoginOk'] && inputs['answer'] === states['trueAnswer']) {
        set(ref(DB, 'users/' + inputs['login'] + '/password'), inputs['password1']);
        window.location.href = './authorization.html';
    } else {
        checkWarningPasswordDuplicate(inputs['password1'], inputs['password2']);
        actualQuestion(inputs['login']);
        warningAnswerIsWrong();
    }
}