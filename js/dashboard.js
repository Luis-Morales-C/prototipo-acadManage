// Gestor del Dashboard
class DashboardManager {
    static async loadDashboard(user) {
        const dashboardScreen = document.getElementById('dashboard-screen');
        
        // Mostrar loading
        window.acadManageApp.showLoading(dashboardScreen);

        try {
            // Cargar datos del dashboard según el rol
            const dashboardData = await this.fetchDashboardData(user.role);
            
            // Renderizar el dashboard
            dashboardScreen.innerHTML = this.generateDashboardHTML(user, dashboardData);
            
            // Configurar event listeners específicos del dashboard
            this.setupDashboardListeners();
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            dashboardScreen.innerHTML = this.generateErrorHTML();
        }
    }

    static async fetchDashboardData(role) {
        // Simular obtención de datos
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = {
                    profesor: {
                        stats: [
                            { label: 'Proyectos Asignados', value: 8, subtitle: '3 requieren atención', icon: 'blue' },
                            { label: 'Entregas por Revisar', value: 5, subtitle: '2 con retraso', icon: 'orange' },
                            { label: 'Retroalimentaciones', value: 12, subtitle: 'Esta semana', icon: 'green' },
                            { label: 'Promedio Avance', value: '64%', subtitle: 'De todos los proyectos', icon: 'purple' }
                        ],
                        projects: DataService.getProfessorProjects(),
                        pendingDeliveries: DataService.getPendingDeliveries()
                    },
                    coordinador: {
                        stats: [
                            { label: 'Total Proyectos Activos', value: 45, subtitle: '+5 este semestre', icon: 'blue' },
                            { label: 'Proyectos al Día', value: 32, subtitle: '71% del total', icon: 'green' },
                            { label: 'Requieren Atención', value: 13, subtitle: '29% del total', icon: 'orange' },
                            { label: 'Docentes Asesores', value: 12, subtitle: '3.8 proyectos/docente', icon: 'purple' }
                        ],
                        criticalProjects: DataService.getCriticalProjects(),
                        analytics: DataService.getAnalyticsData()
                    }
                };
                resolve(data[role] || data.profesor);
            }, 800);
        });
    }

    static generateDashboardHTML(user, data) {
        return `
            <div class="dashboard">
                ${this.generateSidebarHTML(user)}
                <main class="main-content">
                    ${this.generateTopBarHTML(user)}
                    <div class="content-area">
                        ${this.generateStatsGridHTML(data.stats)}
                        ${this.generateMainContentHTML(user.role, data)}
                    </div>
                </main>
            </div>
        `;
    }

    static generateSidebarHTML(user) {
        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <svg viewBox="0 0 24 24" fill="white">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                        </svg>
                    </div>
                    <span class="sidebar-title">AcadManage</span>
                </div>

                <nav class="sidebar-nav">
                    <a href="#" class="nav-item active" data-section="dashboard">
                        <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        <span>Inicio</span>
                    </a>
                    ${user.role === 'estudiante' ? `
                        <a href="#" class="nav-item" data-section="tasks">
                            <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                            </svg>
                            <span>Mis Tareas</span>
                        </a>
                    ` : ''}
                    <a href="#" class="nav-item" data-action="logout">
                        <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        <span>Cerrar Sesión</span>
                    </a>
                </nav>
            </aside>
        `;
    }

    static generateTopBarHTML(user) {
        return `
            <div class="top-bar">
                <div>
                    <h1>Panel de ${user.role === 'profesor' ? 'Asesor' : user.role === 'coordinador' ? 'Control Institucional' : 'Estudiante'}</h1>
                    <p class="subtitle">Bienvenid${user.role === 'profesor' ? 'a' : 'o'}, ${user.name}</p>
                </div>
                <div class="user-profile">
                    <button class="notification-btn">
                        <svg viewBox="0 0 24 24" fill="#64748b">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                        <span class="notification-badge"></span>
                    </button>
                    <div class="user-info">
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-role">${this.getRoleDisplayName(user.role)}</div>
                        </div>
                        <div class="user-avatar">${user.avatar}</div>
                    </div>
                </div>
            </div>
        `;
    }

    static getRoleDisplayName(role) {
        const roles = {
            profesor: 'Docente Asesor',
            coordinador: 'Coordinador Académico',
            estudiante: 'Estudiante'
        };
        return roles[role] || role;
    }

    static setupDashboardListeners() {
        // Aquí irían los event listeners específicos del dashboard
        console.log('Dashboard listeners setup');
    }
}