document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    if (response.status === 200) {
        const user = await response.json();
        localStorage.setItem('userName', user.username);

        localStorage.setItem('userEmail', user.email);
        if(user.role == null || undefined) console.log("NO ROLE")
        localStorage.setItem('userRole', user.role);  

        window.location.href = 'index.html';
    } else {
        alert('Login failed');
    }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;

    const email = document.getElementById('registerEmail').value;

    const password = document.getElementById('registerPassword').value;

    const role = document.getElementById('registerRole').value;

    const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, role })
    });

    if (response.status === 201) {
        const user = await response.json();

        localStorage.setItem('userName', user.username);

        localStorage.setItem('userEmail', user.email);

        localStorage.setItem('userRole', user.role); 

        alert('Registration successful! Please login.');

        document.getElementById('showLogin').click();
    } else {
        alert('Registration failed');
    }
});

document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'none';

    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';

    document.getElementById('registerForm').style.display = 'none';
});
