// Get references to the button and the display text
const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

listButton.addEventListener('click', () => {
    content.textContent = 'All sites';
});

homeButton.addEventListener('click', () => {
    content.textContent = 'Current site';
});