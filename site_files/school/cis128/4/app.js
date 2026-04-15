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
        document.body.style.backgroundImage = "url('light-blue.jpg')"; 
    } else if (choice === 'gold') {
        document.body.style.backgroundImage = "url('light-gold.jpg')";
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

nameInput.addEventListener('input', (e) => {
    const typedName = e.target.value;
    
    if (typedName.trim() !== '') {
        localStorage.setItem('name', typedName);
        nameSpan.textContent = typedName;
    } else {
        localStorage.removeItem('name');
        nameSpan.textContent = 'Guest';
    }
});