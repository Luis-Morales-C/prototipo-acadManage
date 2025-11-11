// Simulación de base de datos de usuarios
const users = [
    { 
        id: 1, 
        username: 'estudiante1', 
        password: '123', 
        role: 'student', 
        name: 'Juan Pérez',
        dashboard: 'dashboard-estudiante.html'
    },
    { 
        id: 2, 
        username: 'docente1', 
        password: '123', 
        role: 'teacher', 
        name: 'María González',
        dashboard: 'dashboard-docente.html'
    },
    { 
        id: 3, 
        username: 'coordinador1', 
        password: '123', 
        role: 'coordinator', 
        name: 'Carlos López',
        dashboard: 'dashboard-coordinador.html'
    }
];

// Función de login
function login(username, password, role) {
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
    );
    
    if (user) {
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

// Función de logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Verificar si hay un usuario logueado
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.dashboard) {
        // Redirigir al dashboard correspondiente
        window.location.href = user.dashboard;
        return true;
    }
    return false;
}

// Manejar el formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            const user = login(username, password, role);
            
            if (user) {
                // Redirigir al dashboard correspondiente
                window.location.href = user.dashboard;
            } else {
                alert('Credenciales incorrectas. Por favor, intenta nuevamente.');
            }
        });
    }
    
    // Manejar logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Verificar autenticación en páginas de dashboard
    if (window.location.pathname !== '/index.html' && 
        !window.location.pathname.endsWith('index.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});