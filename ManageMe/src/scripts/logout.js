document.getElementById('logoutBtn').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include' 
    });

    if (response.status === 200) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    } else {
        alert('Logout failed');
    }
});
