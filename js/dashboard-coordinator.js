// Dashboard específico para Coordinadores
class CoordinatorDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.coordinatorData = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadCoordinatorData();
        this.setupNotifications();
    }

    checkAuthentication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'coordinator') {
            window.location.href = 'index.html';
            return;
        }
        this.updateUserInfo(currentUser);
    }

    updateUserInfo(user) {
        if (user.name) {
            document.querySelector('.user-name').textContent = user.name;
            document.querySelector('.subtitle').textContent = `Bienvenido, ${user.name}`;
            const initials = user.name.split(' ').map(n => n[0]).join('');
            document.querySelector('.user-avatar').textContent = initials;
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchSection(section) {
        console.log(`Coordinador - Cambiando a sección: ${section}`);
        this.showNotification(`Navegando a: ${this.getSectionName(section)}`, 'info');
    }

    getSectionName(section) {
        const sections = {
            'overview': 'Dashboard',
            'projects': 'Todos los Proyectos',
            'teachers': 'Docentes',
            'students': 'Estudiantes',
            'analytics': 'Analítica',
            'reports': 'Reportes',
            'alerts': 'Alertas'
        };
        return sections[section] || section;
    }

    setupEventListeners() {
        // Botones específicos del coordinador
        this.setupExportButtons();
        this.setupContactButtons();
    }

    setupExportButtons() {
        const exportButtons = document.querySelectorAll('.btn-blue');
        exportButtons.forEach(button => {
            if (button.textContent.includes('Exportar')) {
                button.addEventListener('click', (e) => {
                    this.exportData(e);
                });
            }
        });
    }

    setupContactButtons() {
        const contactButtons = document.querySelectorAll('.btn-outline');
        contactButtons.forEach(button => {
            if (button.textContent.includes('Contactar')) {
                button.addEventListener('click', (e) => {
                    this.contactAdvisor(e);
                });
            }
        });
    }

    loadCoordinatorData() {
        this.coordinatorData = {
            name: "Carlos López",
            program: "Ingeniería de Sistemas",
            totalProjects: 45,
            activeStudents: 38,
            atRiskProjects: 7,
            completedProjects: 12,
            totalTeachers: 12,
            projectsPerTeacher: 3.8,
            programMetrics: {
                averageProgress: 67,
                onTimeRate: 71,
                atRiskRate: 29,
                completionRate: 27
            },
            attentionProjects: [
                {
                    id: 1,
                    title: "Aplicación Móvil para Gestión de Inventarios",
                    student: "Ana Martínez",
                    advisor: "Dra. María González",
                    startDate: "2024-08-20",
                    progress: 42,
                    delay: 15,
                    riskLevel: "high"
                }
            ]
        };

        this.updateDashboard();
    }

    updateDashboard() {
        if (!this.coordinatorData) return;

        this.updateStats();
        this.updateProgramMetrics();
        this.updateAttentionProjects();
    }

    updateStats() {
        const stats = {
            'total-projects': this.coordinatorData.totalProjects,
            'active-students': this.coordinatorData.activeStudents,
            'at-risk-projects': this.coordinatorData.atRiskProjects,
            'completed-projects': this.coordinatorData.completedProjects
        };

        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[id*="${key}"]`);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }

    updateProgramMetrics() {
        // Lógica para actualizar métricas del programa
        console.log('Actualizando métricas del programa:', this.coordinatorData.programMetrics);
    }

    updateAttentionProjects() {
        // Lógica para actualizar proyectos que requieren atención
        console.log('Actualizando proyectos de atención:', this.coordinatorData.attentionProjects);
    }

    exportData(e) {
        const dataType = e.target.getAttribute('data-export-type');
        this.showNotification(`Exportando datos de: ${dataType}`, 'info');
    }

    contactAdvisor(e) {
        const advisorId = e.target.getAttribute('data-advisor-id');
        this.showContactModal(advisorId);
    }

    showContactModal(advisorId) {
        this.showNotification(`Contactando al asesor ID: ${advisorId}`, 'info');
    }

    setupNotifications() {
        const notifications = [
            { id: 1, message: 'Proyectos en riesgo requieren atención', read: false },
            { id: 2, message: 'Reporte mensual listo para revisión', read: false }
        ];
        this.updateNotificationBadge(notifications.filter(n => !n.read).length);
    }

    updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.style.display = count > 0 ? 'block' : 'none';
            badge.textContent = count > 9 ? '9+' : count;
        }
    }

    showNotification(message, type = 'info') {
        // Implementación similar a los otros dashboards
        console.log(`Notificación [${type}]: ${message}`);
    }
}

// Inicializar dashboard del coordinador
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new CoordinatorDashboard();
});