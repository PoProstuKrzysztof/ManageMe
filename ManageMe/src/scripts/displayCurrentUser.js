document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userName || !userEmail) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = `Name: ${userName}`;
    document.getElementById('userEmail').textContent = `Email: ${userEmail}`;

});