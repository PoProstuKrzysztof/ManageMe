document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('role');

    if (!userName || !userEmail) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = `Name: ${userName}`;
    document.getElementById('userEmail').textContent = `Email: ${userEmail}`;
    document.getElementById('userRole').textContent =`Role: ${userRole}`;

});