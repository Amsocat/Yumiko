import {
    getDatabase,
    ref,
    get,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import {getCookie, insertAfter} from "./utils.js";

const DB = getDatabase();

const states = {
    likeable: true,
    dislikeable: true,
    authorized: false,
};

if (getCookie('user') !== undefined) {
    states['authorized'] = true;
    document.getElementById('nav-bar').hidden = true;
    let parentNode = document.createElement('nav');
    insertAfter(parentNode, document.getElementById('nav-bar'));
    let exitNode = document.createElement('a');
    parentNode.append(exitNode);
    exitNode.innerText = 'Выход';
    exitNode.onclick = (ev) => {
        document.cookie = 'user=; max-age=-1';
        window.location.reload();
    }
}

document.getElementById('img-like').onclick = (ev) => {
    if (states['likeable'] && states["authorized"]) {
        states['likeable'] = false;
        get(ref(DB, 'counters/like')).then((snapshot) => {
           set(ref(DB,'counters/like'), snapshot.val() + 1).then((snapshot)=>{
               states['likeable'] = true;
           });
        });
    }
}

document.getElementById('img-dislike').onclick = (ev) => {
    if (states['dislikeable'] && states["authorized"]) {
        states['dislikeable'] = false;
        get(ref(DB, 'counters/dislike')).then((snapshot) => {
            set(ref(DB,'counters/dislike'), snapshot.val() + 1).then((snapshot)=>{
                states['dislikeable'] = true;
            });
        });
    }
}

onValue(ref(DB, 'counters/like'), (snapshot) => {
    document.getElementById('counter-like').innerText = snapshot.val();
});
onValue(ref(DB, 'counters/dislike'), (snapshot) => {
    document.getElementById('counter-dislike').innerText = snapshot.val();
});
