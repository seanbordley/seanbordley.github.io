if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registered successfully.', reg))
            .catch(err => console.error('Service Worker registration failed.', err));
    });
}

const bgSelect = document.getElementById('bg-select');
bgSelect.addEventListener('change', (e) => {
    const choice = e.target.value;
    
    if (choice === 'blue') {
        document.body.style.backgroundImage = "url('lightblue.jpg')"; 
    } else if (choice === 'gold') {
        document.body.style.backgroundImage = "url('lightgold.jpg')";
    } else {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = "#ffffff";
    }
});

const nameInput = document.getElementById('name-input');
const nameSpan = document.getElementById('name-span');

const storedName = localStorage.getItem('name');
if (storedName) {
    nameSpan.textContent = storedName;
    nameInput.value = storedName;
}

const saveName = (e) => {
    const typedName = e.target.value;
    
    if (typedName.trim() !== '') {
        localStorage.setItem('name', typedName);
        nameSpan.textContent = typedName;
    } else {
        localStorage.removeItem('name');
        nameSpan.textContent = 'Guest';
    }
};

nameInput.addEventListener('blur', saveName);
nameInput.addEventListener('change', saveName);
nameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        nameInput.blur();
    }
});

let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installButton.style.display = 'none';
    }
});

window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    console.log('PWA was installed');
});