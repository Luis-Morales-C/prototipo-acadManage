// Dashboard específico para Docentes
class TeacherDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.teacherData = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadTeacherData();
        this.setupNotifications();
    }

    checkAuthentication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'teacher') {
            window.location.href = 'index.html';
            return;
        }
        this.updateUserInfo(currentUser);
    }

    updateUserInfo(user) {
        if (user.name) {
            document.querySelector('.user-name').textContent = user.name;
            document.querySelector('.subtitle').textContent = `Bienvenida, ${user.name}`;
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
        console.log(`Docente - Cambiando a sección: ${section}`);
        this.showNotification(`Navegando a: ${this.getSectionName(section)}`, 'info');
    }

    getSectionName(section) {
        const sections = {
            'overview': 'Inicio',
            'advisories': 'Mis Asesorías',
            'reviews': 'Revisiones Pendientes',
            'calendar': 'Calendario',
            'evaluations': 'Evaluaciones',
            'reports': 'Reportes'
        };
        return sections[section] || section;
    }

    setupEventListeners() {
        // Botones específicos del docente
        this.setupReviewButtons();
        this.setupFeedbackButtons();
    }

    setupReviewButtons() {
        const reviewButtons = document.querySelectorAll('.btn-blue');
        reviewButtons.forEach(button => {
            if (button.textContent.includes('Revisar')) {
                button.addEventListener('click', (e) => {
                    this.handleReview(e);
                });
            }
        });
    }

    setupFeedbackButtons() {
        const feedbackButtons = document.querySelectorAll('.btn-outline');
        feedbackButtons.forEach(button => {
            if (button.textContent.includes('Retroalimentación')) {
                button.addEventListener('click', (e) => {
                    this.provideFeedback(e);
                });
            }
        });
    }

    loadTeacherData() {
        this.teacherData = {
            name: "María González",
            teacherId: "PROF-001",
            department: "Ingeniería de Sistemas",
            advisedStudents: 8,
            pendingReviews: 5,
            pendingFeedback: 12,
            atRiskProjects: 2,
            averageProgress: 64,
            advisedProjects: [
                {
                    id: 1,
                    title: "Sistema de Gestión Académica para IES",
                    student: "Juan Pérez",
                    startDate: "2024-08-15",
                    endDate: "2025-05-30",
                    progress: 67,
                    status: "En Desarrollo",
                    lastActivity: "2024-11-20",
                    riskLevel: "low"
                },
                {
                    id: 2,
                    title: "Aplicación Móvil para Gestión de Inventarios",
                    student: "Ana Martínez",
                    startDate: "2024-08-20",
                    endDate: "2025-05-30",
                    progress: 42,
                    status: "Con Retraso",
                    lastActivity: "2024-11-10",
                    riskLevel: "high"
                }
            ],
            pendingReviewsList: [
                {
                    id: 1,
                    student: "Juan Pérez",
                    delivery: "Marco Teórico",
                    submittedDate: "2024-11-19",
                    daysAgo: 2,
                    priority: "medium"
                },
                {
                    id: 2,
                    student: "Ana Martínez",
                    delivery: "Avance Capítulo 3",
                    submittedDate: "2024-11-16",
                    daysAgo: 5,
                    priority: "high"
                }
            ]
        };

        this.updateDashboard();
    }

    updateDashboard() {
        if (!this.teacherData) return;

        this.updateStats();
        this.updateAdvisedProjects();
        this.updatePendingReviews();
    }

    updateStats() {
        const stats = {
            'advised-students': this.teacherData.advisedStudents,
            'pending-reviews': this.teacherData.pendingReviews,
            'pending-feedback': this.teacherData.pendingFeedback,
            'at-risk-projects': this.teacherData.atRiskProjects
        };

        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[id*="${key}"]`);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }

    updateAdvisedProjects() {
        // Lógica para actualizar proyectos asesorados
        console.log('Actualizando proyectos asesorados:', this.teacherData.advisedProjects);
    }

    updatePendingReviews() {
        // Lógica para actualizar revisiones pendientes
        console.log('Actualizando revisiones pendientes:', this.teacherData.pendingReviewsList);
    }

    handleReview(e) {
        const reviewId = e.target.getAttribute('data-review-id');
        this.showReviewModal(reviewId);
    }

    provideFeedback(e) {
        const projectId = e.target.getAttribute('data-project-id');
        this.showFeedbackModal(projectId);
    }

    showReviewModal(reviewId) {
        this.showNotification(`Iniciando revisión para entrega ID: ${reviewId}`, 'info');
    }

    showFeedbackModal(projectId) {
        this.showNotification(`Abriendo formulario de retroalimentación para proyecto ID: ${projectId}`, 'info');
    }

    setupNotifications() {
        const notifications = [
            { id: 1, message: 'Nueva entrega pendiente de revisión', read: false },
            { id: 2, message: 'Recordatorio: Reunión de avance programada', read: false }
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
        // Implementación similar a StudentDashboard
        console.log(`Notificación [${type}]: ${message}`);
        // Aquí iría el código para mostrar notificaciones visuales
    }
}

// Inicializar dashboard del docente
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new TeacherDashboard();
});