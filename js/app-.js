// Archivo principal - Coordina toda la aplicación
class AcadManageApp {
    constructor() {
        this.currentUser = null;
        this.currentScreen = 'login';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Navegación global
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="logout"]')) {
                this.handleLogout();
            }
            
            if (e.target.matches('[data-screen]')) {
                const screen = e.target.getAttribute('data-screen');
                this.showScreen(screen);
            }
        });
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const role = formData.get('role');

        try {
            const user = await AuthService.login(username, password, role);
            
            if (user) {
                this.currentUser = user;
                this.showScreen('dashboard');
                this.showNotification('¡Bienvenido!', 'success');
            } else {
                this.showNotification('Credenciales incorrectas', 'error');
            }
        } catch (error) {
            this.showNotification('Error al iniciar sesión', 'error');
            console.error('Login error:', error);
        }
    }

    handleLogout() {
        AuthService.logout();
        this.currentUser = null;
        this.showScreen('login');
        this.showNotification('Sesión cerrada', 'info');
    }

    showScreen(screenName) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar pantalla seleccionada
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;

            // Cargar contenido específico de la pantalla
            this.loadScreenContent(screenName);
        }
    }

    async loadScreenContent(screenName) {
        switch (screenName) {
            case 'dashboard':
                await DashboardManager.loadDashboard(this.currentUser);
                break;
            case 'tasks':
                await TaskManager.loadTasks(this.currentUser);
                break;
            // Agregar más casos según sea necesario
        }
    }

    checkAuthStatus() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.showScreen('dashboard');
        } else {
            this.showScreen('login');
        }
    }

    async loadInitialData() {
        try {
            // Cargar datos iniciales necesarios
            await DataService.initialize();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // Método utilitario para formatear fechas
    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Método para mostrar loading
    showLoading(container) {
        const loadingHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Cargando...</p>
            </div>
        `;
        container.innerHTML = loadingHTML;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.acadManageApp = new AcadManageApp();
});