// Dashboard específico para Estudiantes
class StudentDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.studentData = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.loadStudentData();
        this.setupNotifications();
        this.loadSection('overview');
    }

    // Verificar autenticación
    checkAuthentication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'student') {
            window.location.href = 'index.html';
            return;
        }
        this.updateUserInfo(currentUser);
    }

    // Actualizar información del usuario
    updateUserInfo(user) {
        if (user.name) {
            document.querySelector('.user-name').textContent = user.name;
            document.querySelector('.subtitle').textContent = `Bienvenido, ${user.name}`;
            document.querySelector('#user-name').textContent = user.name;
            document.querySelector('#top-user-name').textContent = user.name;
            
            const initials = user.name.split(' ').map(n => n[0]).join('');
            document.querySelector('.user-avatar').textContent = initials;
            document.querySelector('#user-avatar').textContent = initials;
        }
    }
// Configurar navegación entre secciones
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

    // Configurar botón de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    // Configurar botón de notificaciones
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            this.toggleNotifications();
        });
    }
}

    // Cambiar entre secciones del dashboard
    switchSection(section) {
        this.currentSection = section;
        this.loadSection(section);
        this.updatePageTitle(this.getSectionName(section));
    }

    // Actualizar título de la página
    updatePageTitle(sectionName) {
        const pageTitle = document.getElementById('page-title');
        if (sectionName === 'Inicio') {
            pageTitle.textContent = 'Panel del Estudiante';
        } else {
            pageTitle.textContent = `${sectionName} - Estudiante`;
        }
    }

    // Obtener nombre amigable de la sección
    getSectionName(section) {
        const sections = {
            'overview': 'Inicio',
            'projects': 'Mi Proyecto',
            'deliveries': 'Entregas',
            'tasks': 'Tareas',
            'calendar': 'Calendario',
            'communication': 'Comunicación',
            'settings': 'Configuración'
        };
        return sections[section] || section;
    }

    // Cargar sección específica
    async loadSection(section) {
        const contentArea = document.getElementById('content-area');
        
        try {
            const response = await fetch(`sections/${section}.html`);
            if (!response.ok) {
                throw new Error('Sección no encontrada');
            }
            const content = await response.text();
            contentArea.innerHTML = content;
            
            // Inicializar componentes específicos de la sección
            this.initializeSection(section);
            
        } catch (error) {
            console.error('Error loading section:', error);
            contentArea.innerHTML = this.getFallbackContent(section);
            this.initializeSection(section);
        }
    }

    // Contenido de respaldo si no hay archivo HTML
    getFallbackContent(section) {
        const sections = {
            'overview': this.getOverviewContent(),
            'projects': this.getProjectsContent(),
            'deliveries': this.getDeliveriesContent(),
            'tasks': this.getTasksContent(),
            'calendar': this.getCalendarContent(),
            'communication': this.getCommunicationContent(),
            'settings': this.getSettingsContent()
        };
        return sections[section] || '<div class="card"><div class="card-body"><p>Sección en desarrollo</p></div></div>';
    }

    // Inicializar componentes de la sección
    initializeSection(section) {
        // Cargar datos específicos de la sección
        if (this.studentData) {
            this.updateSectionContent(section);
        }
        
        // Configurar event listeners específicos
        this.setupSectionEventListeners(section);
    }

    // Actualizar contenido de la sección con datos
    updateSectionContent(section) {
        switch(section) {
            case 'overview':
                this.updateOverviewContent();
                break;
            case 'projects':
                this.updateProjectsContent();
                break;
            case 'deliveries':
                this.updateDeliveriesContent();
                break;
            case 'tasks':
                this.updateTasksContent();
                break;
            case 'calendar':
                this.updateCalendarContent();
                break;
            case 'communication':
                this.updateCommunicationContent();
                break;
        }
    }

    // Configurar event listeners de la sección
    setupSectionEventListeners(section) {
        switch(section) {
            case 'overview':
                this.setupOverviewEventListeners();
                break;
            case 'projects':
                this.setupProjectsEventListeners();
                break;
            case 'deliveries':
                this.setupDeliveriesEventListeners();
                break;
            case 'tasks':
                this.setupTasksEventListeners();
                break;
            case 'calendar':
                this.setupCalendarEventListeners();
                break;
            case 'communication':
                this.setupCommunicationEventListeners();
                break;
        }
    }

    // ========== CONTENIDO DE LAS SECCIONES ==========

    getOverviewContent() {
        return `
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-label">Tareas Pendientes</div>
                    <div class="stat-value" id="student-pending-tasks">3</div>
                    <div class="stat-subtitle">2 con fecha próxima</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-label">Entregas Completadas</div>
                    <div class="stat-value" id="student-completed-tasks">7</div>
                    <div class="stat-subtitle">Última: 15 Nov</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-label">Próxima Entrega</div>
                    <div class="stat-value" id="student-next-deadline">30 Nov</div>
                    <div class="stat-subtitle">Capítulo 4</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-label">Progreso General</div>
                    <div class="stat-value" id="student-overall-progress">65%</div>
                    <div class="stat-subtitle">+5% este mes</div>
                </div>
            </div>

            <!-- Two Column Grid -->
            <div class="two-column-grid">
                <!-- Mi Proyecto -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mi Proyecto</h3>
                        <button class="btn btn-outline" id="edit-project-btn">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="project-info" id="project-overview-info">
                            <!-- Se llena dinámicamente -->
                        </div>
                    </div>
                </div>

                <!-- Próximas Entregas -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Próximas Entregas</h3>
                    </div>
                    <div class="card-body" id="upcoming-deliveries-list">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>
            </div>

            <!-- Retroalimentación Reciente -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Retroalimentación Reciente</h3>
                </div>
                <div class="card-body" id="recent-feedback-list">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>

            <!-- Alertas IA -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-robot"></i> Alertas Predictivas IA</h3>
                </div>
                <div class="card-body" id="ai-alerts-list">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
        `;
    }

    getProjectsContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Mi Proyecto de Tesis</h2>
                    <p>Gestión y seguimiento de tu proyecto de investigación</p>
                </div>

                <!-- Información del Proyecto -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Información del Proyecto</h3>
                        <button class="btn btn-outline" id="edit-project-details-btn">
                            <i class="fas fa-edit"></i>
                            Editar Proyecto
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="project-details-grid">
                            <div class="project-main-info">
                                <h4 id="project-title">Sistema de Gestión Académica para IES</h4>
                                <div class="project-meta">
                                    <div class="meta-item">
                                        <strong>Asesor:</strong>
                                        <span id="project-advisor">Dra. María González</span>
                                    </div>
                                    <div class="meta-item">
                                        <strong>Estado:</strong>
                                        <span class="status-badge success">En Progreso</span>
                                    </div>
                                    <div class="meta-item">
                                        <strong>Programa:</strong>
                                        <span id="project-program">Ingeniería de Sistemas</span>
                                    </div>
                                </div>
                            </div>

                            <div class="project-dates">
                                <div class="date-item">
                                    <i class="fas fa-play-circle"></i>
                                    <div>
                                        <strong>Fecha Inicio</strong>
                                        <p id="project-start-date">15 Ago 2024</p>
                                    </div>
                                </div>
                                <div class="date-item">
                                    <i class="fas fa-flag-checkered"></i>
                                    <div>
                                        <strong>Fecha Entrega</strong>
                                        <p id="project-end-date">30 May 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Descripción -->
                        <div class="project-description">
                            <h5>Descripción del Proyecto</h5>
                            <p id="project-description">Desarrollo de una plataforma web para la gestión integral de procesos académicos en instituciones de educación superior.</p>
                        </div>

                        <!-- Progreso -->
                        <div class="progress-section">
                            <div class="progress-bar-container">
                                <div class="progress-header">
                                    <span class="progress-label">Avance General del Proyecto</span>
                                    <span class="progress-value" id="project-progress">65%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 65%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cronograma -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Cronograma de Entregas</h3>
                    </div>
                    <div class="card-body">
                        <div class="timeline">
                            <div class="timeline-item completed">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <h4>Propuesta de Proyecto</h4>
                                    <p>Entregado: 30 Ago 2024</p>
                                    <span class="status-badge success">Aprobado</span>
                                </div>
                            </div>
                            <div class="timeline-item completed">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <h4>Marco Teórico</h4>
                                    <p>Entregado: 15 Nov 2024</p>
                                    <span class="status-badge success">En Revisión</span>
                                </div>
                            </div>
                            <div class="timeline-item current">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <h4>Capítulo 4 - Desarrollo</h4>
                                    <p>Vence: 30 Nov 2024</p>
                                    <span class="status-badge warning">En Progreso</span>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <h4>Análisis de Resultados</h4>
                                    <p>Vence: 15 Dic 2024</p>
                                    <span class="status-badge">Pendiente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDeliveriesContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Gestión de Entregas</h2>
                    <p>Administra y realiza tus entregas académicas</p>
                </div>

                <!-- Filtros -->
                <div class="card">
                    <div class="card-body">
                        <div class="filter-bar">
                            <div class="filter-group">
                                <label for="status-filter">Filtrar por estado:</label>
                                <select id="status-filter" class="form-select">
                                    <option value="all">Todas las entregas</option>
                                    <option value="pending">Pendientes</option>
                                    <option value="completed">Completadas</option>
                                    <option value="overdue">Vencidas</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label for="type-filter">Tipo de entrega:</label>
                                <select id="type-filter" class="form-select">
                                    <option value="all">Todos los tipos</option>
                                    <option value="chapter">Capítulos</option>
                                    <option value="analysis">Análisis</option>
                                    <option value="proposal">Propuestas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lista de Entregas -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mis Entregas</h3>
                        <span class="badge" id="pending-deliveries-count">2 pendientes</span>
                    </div>
                    <div class="card-body">
                        <div class="deliveries-list" id="deliveries-list">
                            <!-- Se llena dinámicamente -->
                        </div>
                    </div>
                </div>

                <!-- Historial de Entregas -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Historial de Entregas</h3>
                    </div>
                    <div class="card-body">
                        <div class="delivery-history">
                            <div class="delivery-item completed">
                                <div class="delivery-left">
                                    <div class="delivery-icon completed">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="delivery-info">
                                        <h4>Marco Teórico</h4>
                                        <p>Entregado: 14 Nov 2024</p>
                                        <small>Documento completo del marco teórico con referencias actualizadas</small>
                                    </div>
                                </div>
                                <div class="delivery-status">
                                    <span class="status-badge success">En Revisión</span>
                                    <button class="btn btn-outline view-feedback-btn">
                                        <i class="fas fa-comment"></i>
                                        Ver Retroalimentación
                                    </button>
                                </div>
                            </div>

                            <div class="delivery-item completed">
                                <div class="delivery-left">
                                    <div class="delivery-icon completed">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="delivery-info">
                                        <h4>Capítulo 3 - Metodología</h4>
                                        <p>Entregado: 30 Oct 2024</p>
                                        <small>Metodología de investigación y diseño del sistema</small>
                                    </div>
                                </div>
                                <div class="delivery-status">
                                    <span class="status-badge success">Aprobado</span>
                                    <button class="btn btn-outline view-feedback-btn">
                                        <i class="fas fa-comment"></i>
                                        Ver Retroalimentación
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTasksContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Mis Tareas</h2>
                    <p>Organiza y realiza seguimiento a tus actividades</p>
                </div>

                <!-- Resumen de Tareas -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="fas fa-list-alt"></i>
                        </div>
                        <div class="stat-label">Total de Tareas</div>
                        <div class="stat-value">8</div>
                        <div class="stat-subtitle">Este semestre</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-label">Pendientes</div>
                        <div class="stat-value">3</div>
                        <div class="stat-subtitle">2 con fecha próxima</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-label">Completadas</div>
                        <div class="stat-value">5</div>
                        <div class="stat-subtitle">62% completado</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div class="stat-label">Próxima Vence</div>
                        <div class="stat-value">30 Nov</div>
                        <div class="stat-subtitle">Capítulo 4</div>
                    </div>
                </div>

                <!-- Lista de Tareas -->
                <div class="two-column-grid">
                    <!-- Tareas Pendientes -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tareas Pendientes</h3>
                            <span class="badge">3</span>
                        </div>
                        <div class="card-body">
                            <div class="tasks-list">
                                <div class="task-item urgent">
                                    <div class="task-checkbox">
                                        <input type="checkbox" id="task1">
                                        <label for="task1"></label>
                                    </div>
                                    <div class="task-content">
                                        <h4>Revisión Capítulo 4 - Desarrollo</h4>
                                        <p>Revisar y corregir el capítulo de desarrollo del sistema</p>
                                        <div class="task-meta">
                                            <span class="task-due">Vence: 25 Nov 2024</span>
                                            <span class="task-priority high">Alta Prioridad</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="task-item">
                                    <div class="task-checkbox">
                                        <input type="checkbox" id="task2">
                                        <label for="task2"></label>
                                    </div>
                                    <div class="task-content">
                                        <h4>Preparar presentación avances</h4>
                                        <p>Preparar slides para presentación de avances semestral</p>
                                        <div class="task-meta">
                                            <span class="task-due">Vence: 28 Nov 2024</span>
                                            <span class="task-priority medium">Media Prioridad</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="task-item">
                                    <div class="task-checkbox">
                                        <input type="checkbox" id="task3">
                                        <label for="task3"></label>
                                    </div>
                                    <div class="task-content">
                                        <h4>Reunión con asesor</h4>
                                        <p>Preparar agenda y materiales para reunión de seguimiento</p>
                                        <div class="task-meta">
                                            <span class="task-due">Vence: 29 Nov 2024</span>
                                            <span class="task-priority low">Baja Prioridad</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tareas Completadas -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tareas Completadas</h3>
                            <span class="badge success">5</span>
                        </div>
                        <div class="card-body">
                            <div class="tasks-list completed">
                                <div class="task-item completed">
                                    <div class="task-checkbox">
                                        <input type="checkbox" id="task4" checked>
                                        <label for="task4"></label>
                                    </div>
                                    <div class="task-content">
                                        <h4>Entregar Marco Teórico</h4>
                                        <p>Documento completo con referencias bibliográficas</p>
                                        <div class="task-meta">
                                            <span class="task-completed">Completado: 14 Nov 2024</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="task-item completed">
                                    <div class="task-checkbox">
                                        <input type="checkbox" id="task5" checked>
                                        <label for="task5"></label>
                                    </div>
                                    <div class="task-content">
                                        <h4>Revisión bibliográfica</h4>
                                        <p>Análisis de papers y artículos relacionados</p>
                                        <div class="task-meta">
                                            <span class="task-completed">Completado: 10 Nov 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCalendarContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Calendario Académico</h2>
                    <p>Planifica y organiza tus actividades académicas</p>
                </div>

                <!-- Vista de Calendario -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Noviembre 2024</h3>
                        <div class="calendar-controls">
                            <button class="btn btn-outline">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="btn btn-outline">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            <button class="btn btn-blue">
                                <i class="fas fa-plus"></i>
                                Nueva Actividad
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="calendar-view">
                            <div class="calendar-header">
                                <div class="calendar-day">Lun</div>
                                <div class="calendar-day">Mar</div>
                                <div class="calendar-day">Mié</div>
                                <div class="calendar-day">Jue</div>
                                <div class="calendar-day">Vie</div>
                                <div class="calendar-day">Sáb</div>
                                <div class="calendar-day">Dom</div>
                            </div>
                            <div class="calendar-grid">
                                <!-- Días del mes -->
                                <div class="calendar-day empty"></div>
                                <div class="calendar-day empty"></div>
                                <div class="calendar-day">
                                    <span class="day-number">1</span>
                                </div>
                                <div class="calendar-day">
                                    <span class="day-number">2</span>
                                </div>
                                <!-- ... más días -->
                                <div class="calendar-day event-day">
                                    <span class="day-number">25</span>
                                    <div class="calendar-event delivery">
                                        <span>Entrega Capítulo 4</span>
                                    </div>
                                </div>
                                <div class="calendar-day event-day">
                                    <span class="day-number">28</span>
                                    <div class="calendar-event meeting">
                                        <span>Reunión con asesor</span>
                                    </div>
                                </div>
                                <div class="calendar-day">
                                    <span class="day-number">29</span>
                                </div>
                                <div class="calendar-day">
                                    <span class="day-number">30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Próximos Eventos -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Próximos Eventos</h3>
                    </div>
                    <div class="card-body">
                        <div class="upcoming-events">
                            <div class="event-item">
                                <div class="event-date">
                                    <span class="event-day">25</span>
                                    <span class="event-month">Nov</span>
                                </div>
                                <div class="event-details">
                                    <h4>Entrega Capítulo 4 - Desarrollo</h4>
                                    <p>Fecha límite para entrega del capítulo de desarrollo</p>
                                    <span class="event-time">
                                        <i class="fas fa-clock"></i>
                                        Todo el día
                                    </span>
                                </div>
                                <div class="event-actions">
                                    <span class="status-badge warning">Próximo</span>
                                </div>
                            </div>

                            <div class="event-item">
                                <div class="event-date">
                                    <span class="event-day">28</span>
                                    <span class="event-month">Nov</span>
                                </div>
                                <div class="event-details">
                                    <h4>Reunión de Seguimiento</h4>
                                    <p>Reunión con Dra. María González para revisar avances</p>
                                    <span class="event-time">
                                        <i class="fas fa-clock"></i>
                                        10:00 AM - 11:30 AM
                                    </span>
                                </div>
                                <div class="event-actions">
                                    <span class="status-badge info">Agendado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCommunicationContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Comunicación</h2>
                    <p>Mantente en contacto con tu asesor y compañeros</p>
                </div>

                <div class="two-column-grid">
                    <!-- Mensajes -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Mensajes</h3>
                            <button class="btn btn-blue">
                                <i class="fas fa-plus"></i>
                                Nuevo Mensaje
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="messages-list">
                                <div class="message-item unread">
                                    <div class="message-avatar">
                                        <div class="avatar">MG</div>
                                    </div>
                                    <div class="message-content">
                                        <div class="message-header">
                                            <h4>Dra. María González</h4>
                                            <span class="message-time">Hoy, 10:30 AM</span>
                                        </div>
                                        <p class="message-preview">Excelente trabajo en el marco teórico. Tenemos que coordinar la reunión de la próxima semana para revisar los avances del capítulo 4...</p>
                                    </div>
                                    <div class="message-status">
                                        <span class="unread-indicator"></span>
                                    </div>
                                </div>

                                <div class="message-item">
                                    <div class="message-avatar">
                                        <div class="avatar">CR</div>
                                    </div>
                                    <div class="message-content">
                                        <div class="message-header">
                                            <h4>Carlos Rodríguez</h4>
                                            <span class="message-time">Ayer, 3:15 PM</span>
                                        </div>
                                        <p class="message-preview">Hola Juan, ¿podrías compartirme la bibliografía que usaste para el estado del arte? Me sería de mucha ayuda...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Foro de Proyecto -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Foro del Proyecto</h3>
                        </div>
                        <div class="card-body">
                            <div class="forum-discussions">
                                <div class="discussion-item">
                                    <div class="discussion-header">
                                        <h4>Problemas con la base de datos</h4>
                                        <span class="discussion-date">25 Nov 2024</span>
                                    </div>
                                    <div class="discussion-meta">
                                        <span class="discussion-author">Por: Carlos Rodríguez</span>
                                        <span class="discussion-replies">5 respuestas</span>
                                    </div>
                                    <p class="discussion-preview">Estoy teniendo problemas para configurar la conexión a la base de datos MySQL. ¿Alguien ha tenido el mismo error?...</p>
                                </div>

                                <div class="discussion-item">
                                    <div class="discussion-header">
                                        <h4>Recursos para metodología ágil</h4>
                                        <span class="discussion-date">23 Nov 2024</span>
                                    </div>
                                    <div class="discussion-meta">
                                        <span class="discussion-author">Por: Ana García</span>
                                        <span class="discussion-replies">3 respuestas</span>
                                    </div>
                                    <p class="discussion-preview">Comparto algunos recursos útiles que encontré sobre metodologías ágiles aplicadas a proyectos de software...</p>
                                </div>
                            </div>

                            <div class="forum-actions">
                                <button class="btn btn-outline">
                                    <i class="fas fa-eye"></i>
                                    Ver Todos los Temas
                                </button>
                                <button class="btn btn-blue">
                                    <i class="fas fa-plus"></i>
                                    Nuevo Tema
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contactos -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Contactos</h3>
                    </div>
                    <div class="card-body">
                        <div class="contacts-grid">
                            <div class="contact-item">
                                <div class="contact-avatar">
                                    <div class="avatar large">MG</div>
                                </div>
                                <div class="contact-info">
                                    <h4>Dra. María González</h4>
                                    <p>Asesor de Proyecto</p>
                                    <span class="contact-email">maria.gonzalez@universidad.edu</span>
                                </div>
                                <div class="contact-actions">
                                    <button class="btn btn-outline">
                                        <i class="fas fa-envelope"></i>
                                        Email
                                    </button>
                                    <button class="btn btn-blue">
                                        <i class="fas fa-comment"></i>
                                        Mensaje
                                    </button>
                                </div>
                            </div>

                            <div class="contact-item">
                                <div class="contact-avatar">
                                    <div class="avatar large">CR</div>
                                </div>
                                <div class="contact-info">
                                    <h4>Carlos Rodríguez</h4>
                                    <p>Compañero de Proyecto</p>
                                    <span class="contact-status online">En línea</span>
                                </div>
                                <div class="contact-actions">
                                    <button class="btn btn-outline">
                                        <i class="fas fa-comment"></i>
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="content-section">
                <div class="section-header">
                    <h2>Configuración</h2>
                    <p>Personaliza tu experiencia en la plataforma</p>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Preferencias de Notificaciones</h3>
                    </div>
                    <div class="card-body">
                        <div class="settings-list">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Notificaciones por Email</h4>
                                    <p>Recibe notificaciones importantes por correo electrónico</p>
                                </div>
                                <div class="setting-control">
                                    <label class="switch">
                                        <input type="checkbox" checked>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Recordatorios de Entregas</h4>
                                    <p>Alertas automáticas para fechas límite próximas</p>
                                </div>
                                <div class="setting-control">
                                    <label class="switch">
                                        <input type="checkbox" checked>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Notificaciones de Retroalimentación</h4>
                                    <p>Avisos cuando recibas comentarios de tu asesor</p>
                                </div>
                                <div class="setting-control">
                                    <label class="switch">
                                        <input type="checkbox" checked>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Información Personal</h3>
                    </div>
                    <div class="card-body">
                        <form class="settings-form">
                            <div class="form-group">
                                <label for="student-name">Nombre Completo</label>
                                <input type="text" id="student-name" value="Juan Pérez" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="student-email">Correo Electrónico</label>
                                <input type="email" id="student-email" value="juan.perez@estudiante.edu" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="student-program">Programa Académico</label>
                                <input type="text" id="student-program" value="Ingeniería de Sistemas" class="form-input" readonly>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-blue">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== ACTUALIZACIÓN DE CONTENIDO DINÁMICO ==========

    updateOverviewContent() {
        if (!this.studentData) return;

        // Actualizar estadísticas
        this.updateStats(this.studentData);
        
        // Actualizar información del proyecto
        this.updateProjectOverviewInfo(this.studentData.project);
        
        // Actualizar entregas próximas
        this.updateOverviewDeliveries(this.studentData.upcomingDeliveries);
        
        // Actualizar retroalimentación
        this.updateOverviewFeedback(this.studentData.recentFeedback);
        
        // Actualizar alertas IA
        this.updateOverviewAIAlerts(this.studentData.aiAlerts);
    }

    updateStats(data) {
        const stats = {
            'student-pending-tasks': data.pendingTasks,
            'student-completed-tasks': data.completedDeliveries,
            'student-next-deadline': data.nextDeadline,
            'student-overall-progress': `${data.overallProgress}%`
        };

        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }

    updateProjectOverviewInfo(project) {
        const projectInfo = document.getElementById('project-overview-info');
        if (!projectInfo) return;

        projectInfo.innerHTML = `
            <h4>${project.title}</h4>
            <p><strong>Asesor:</strong> ${project.advisor}</p>
            <p><strong>Fecha Inicio:</strong> ${project.startDate}</p>
            <p><strong>Fecha Entrega:</strong> ${project.endDate}</p>
            <p><strong>Descripción:</strong> ${project.description}</p>
            
            <div class="progress-bar-container">
                <div class="progress-header">
                    <span class="progress-label">Avance del Proyecto</span>
                    <span class="progress-value">${project.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%;"></div>
                </div>
            </div>
        `;
    }

    updateOverviewDeliveries(deliveries) {
        const deliveryContainer = document.getElementById('upcoming-deliveries-list');
        if (!deliveryContainer) return;

        deliveryContainer.innerHTML = '';

        deliveries.forEach(delivery => {
            const deliveryItem = document.createElement('div');
            deliveryItem.className = 'delivery-item';
            deliveryItem.setAttribute('data-delivery-id', delivery.id);
            
            let buttonHtml = '';
            if (delivery.type === 'pending') {
                buttonHtml = `
                    <button class="btn btn-blue deliver-btn" data-delivery-id="${delivery.id}">
                        <i class="fas fa-upload"></i>
                        Entregar
                    </button>
                `;
            } else {
                buttonHtml = `<span class="status-badge success">${delivery.status}</span>`;
            }

            deliveryItem.innerHTML = `
                <div class="delivery-left">
                    <div class="delivery-icon ${delivery.type}">
                        <i class="fas fa-${delivery.type === 'completed' ? 'check' : 'file-alt'}"></i>
                    </div>
                    <div class="delivery-info">
                        <h4>${delivery.title}</h4>
                        <p>${delivery.type === 'pending' ? `Vence en ${delivery.dueIn} días` : `Entregado el ${delivery.submittedDate}`}</p>
                        ${delivery.description ? `<small>${delivery.description}</small>` : ''}
                    </div>
                </div>
                ${buttonHtml}
            `;

            deliveryContainer.appendChild(deliveryItem);
        });

        // Re-asignar event listeners
        this.setupDeliveryButtons();
    }

    updateOverviewFeedback(feedback) {
        const feedbackContainer = document.getElementById('recent-feedback-list');
        if (!feedbackContainer) return;

        feedbackContainer.innerHTML = '';

        feedback.forEach(item => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <span class="feedback-from">${item.from}</span>
                    <span class="feedback-date">${item.date}</span>
                </div>
                ${item.delivery ? `<p class="feedback-delivery"><strong>Entrega:</strong> ${item.delivery}</p>` : ''}
                <p class="feedback-message">${item.message}</p>
            `;
            feedbackContainer.appendChild(feedbackItem);
        });
    }

    updateOverviewAIAlerts(alerts) {
        const alertsContainer = document.getElementById('ai-alerts-list');
        if (!alertsContainer) return;

        alertsContainer.innerHTML = '';

        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            alertItem.innerHTML = `
                <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                <div>
                    <strong>${alert.title}</strong>
                    <p>${alert.message}</p>
                </div>
            `;
            alertsContainer.appendChild(alertItem);
        });
    }

    // ========== CONFIGURACIÓN DE EVENT LISTENERS ==========

    setupOverviewEventListeners() {
        // Botón de editar proyecto
        const editProjectBtn = document.getElementById('edit-project-btn');
        if (editProjectBtn) {
            editProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.editProject();
            });
        }

        // Botones de entrega
        this.setupDeliveryButtons();
        
        // Botones de detalles
        this.setupDetailButtons();
    }

    setupDeliveryButtons() {
        const deliverButtons = document.querySelectorAll('.deliver-btn');
        deliverButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleDelivery(e);
            });
        });
    }

    setupDetailButtons() {
        const detailButtons = document.querySelectorAll('.detail-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.showTaskDetails(e);
            });
        });
    }

    setupProjectsEventListeners() {
        const editProjectBtn = document.getElementById('edit-project-details-btn');
        if (editProjectBtn) {
            editProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.editProject();
            });
        }
    }

    setupDeliveriesEventListeners() {
        this.setupDeliveryButtons();
        
        // Filtros
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterDeliveries();
            });
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterDeliveries();
            });
        }
    }

    setupTasksEventListeners() {
        // Checkboxes de tareas
        const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTaskCompletion(e.target);
            });
        });
    }

    setupCalendarEventListeners() {
        // Botones de control del calendario
        const prevBtn = document.querySelector('.calendar-controls .btn:first-child');
        const nextBtn = document.querySelector('.calendar-controls .btn:nth-child(2)');
        const newEventBtn = document.querySelector('.calendar-controls .btn-blue');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.showNotification('Navegando al mes anterior', 'info');
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.showNotification('Navegando al mes siguiente', 'info');
            });
        }
        
        if (newEventBtn) {
            newEventBtn.addEventListener('click', () => {
                this.showNotification('Funcionalidad de nuevo evento en desarrollo', 'info');
            });
        }
    }

    setupCommunicationEventListeners() {
        // Botones de mensajes
        const newMessageBtn = document.querySelector('.btn-blue');
        if (newMessageBtn && newMessageBtn.textContent.includes('Nuevo Mensaje')) {
            newMessageBtn.addEventListener('click', () => {
                this.showNotification('Funcionalidad de nuevo mensaje en desarrollo', 'info');
            });
        }
        
        // Botones del foro
        const newTopicBtn = document.querySelector('.forum-actions .btn-blue');
        if (newTopicBtn) {
            newTopicBtn.addEventListener('click', () => {
                this.showNotification('Funcionalidad de nuevo tema en desarrollo', 'info');
            });
        }
    }

    // ========== FUNCIONALIDADES EXISTENTES ==========

    // Cargar datos del estudiante
    loadStudentData() {
        // Datos simulados del estudiante
        this.studentData = {
            name: "Juan Pérez",
            studentId: "2024001",
            program: "Ingeniería de Sistemas",
            semester: "10mo",
            pendingTasks: 3,
            completedDeliveries: 7,
            nextDeadline: "30 Nov",
            overallProgress: 65,
            project: {
                title: "Sistema de Gestión Académica para IES",
                advisor: "Dra. María González",
                startDate: "15 Ago 2024",
                endDate: "30 May 2025",
                progress: 65,
                description: "Desarrollo de una plataforma web para la gestión integral de procesos académicos en instituciones de educación superior."
            },
            upcomingDeliveries: [
                {
                    id: 1,
                    title: "Capítulo 4 - Desarrollo",
                    dueDate: "2024-11-30",
                    dueIn: 5,
                    type: "pending",
                    description: "Desarrollo del sistema y documentación del capítulo 4"
                },
                {
                    id: 2,
                    title: "Análisis de Resultados",
                    dueDate: "2024-12-07",
                    dueIn: 12,
                    type: "pending",
                    description: "Análisis de los resultados obtenidos en las pruebas del sistema"
                },
                {
                    id: 3,
                    title: "Marco Teórico",
                    dueDate: "2024-11-15",
                    type: "completed",
                    status: "En Revisión",
                    submittedDate: "2024-11-14"
                }
            ],
            recentFeedback: [
                {
                    from: "Dra. María González",
                    date: "Hoy, 10:30 AM",
                    message: "Excelente trabajo en el marco teórico. Sugiero profundizar en la sección de estado del arte con más referencias actualizadas.",
                    delivery: "Marco Teórico"
                },
                {
                    from: "Dra. María González",
                    date: "Ayer, 3:15 PM",
                    message: "La metodología está bien estructurada. Recuerda incluir los instrumentos de recolección de datos en el siguiente avance.",
                    delivery: "Capítulo 3 - Metodología"
                }
            ],
            aiAlerts: [
                {
                    type: "success",
                    title: "Buen progreso",
                    message: "Vas 5% por encima del promedio esperado para esta etapa.",
                    priority: "low"
                },
                {
                    type: "warning",
                    title: "Próxima entrega",
                    message: "Tu siguiente entrega está programada para dentro de 5 días.",
                    priority: "medium"
                }
            ]
        };

        // Actualizar la sección actual si ya está cargada
        if (this.currentSection) {
            this.updateSectionContent(this.currentSection);
        }
    }

    // Manejar entrega de tarea
    handleDelivery(e) {
        const button = e.target.closest('.deliver-btn');
        const deliveryId = button.getAttribute('data-delivery-id');
        
        const delivery = this.studentData.upcomingDeliveries.find(d => d.id == deliveryId);
        
        this.showDeliveryModal(delivery);
    }

    // Mostrar modal para entregar tarea
    showDeliveryModal(delivery) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Entregar: ${delivery.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="delivery-info">
                        <p><strong>Descripción:</strong> ${delivery.description}</p>
                        <p><strong>Fecha límite:</strong> ${delivery.dueDate} (En ${delivery.dueIn} días)</p>
                    </div>
                    <form id="delivery-form" class="delivery-form">
                        <div class="form-group">
                            <label for="delivery-file">Subir archivo *</label>
                            <input type="file" id="delivery-file" accept=".pdf,.doc,.docx,.zip,.rar" required>
                            <small>Formatos aceptados: PDF, Word, ZIP, RAR (Máx. 10MB)</small>
                        </div>
                        <div class="form-group">
                            <label for="delivery-notes">Comentarios adicionales</label>
                            <textarea id="delivery-notes" placeholder="Agrega cualquier comentario o observación sobre tu entrega..." rows="4"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline cancel-btn">Cancelar</button>
                            <button type="submit" class="btn btn-blue">Enviar Entrega</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners del modal
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = modal.querySelector('#delivery-form');

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitDelivery(form, delivery);
            closeModal();
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Enviar entrega
    submitDelivery(form, delivery) {
        const fileInput = form.querySelector('#delivery-file');
        const notes = form.querySelector('#delivery-notes').value;

        if (fileInput.files.length === 0) {
            this.showNotification('Por favor selecciona un archivo para entregar.', 'error');
            return;
        }

        const file = fileInput.files[0];
        
        // Validar tamaño del archivo (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('El archivo es demasiado grande. Máximo 10MB permitido.', 'error');
            return;
        }

        // Simular envío a servidor
        this.showNotification(`¡Entrega "${delivery.title}" enviada correctamente!`, 'success');
        
        // Actualizar datos localmente
        this.updateAfterDelivery(delivery.id);
    }

    // Actualizar interfaz después de entrega
    updateAfterDelivery(deliveryId) {
        // Encontrar la entrega en los datos
        const deliveryIndex = this.studentData.upcomingDeliveries.findIndex(d => d.id == deliveryId);
        if (deliveryIndex !== -1) {
            // Actualizar estado de la entrega
            this.studentData.upcomingDeliveries[deliveryIndex] = {
                ...this.studentData.upcomingDeliveries[deliveryIndex],
                type: 'completed',
                status: 'En Revisión',
                submittedDate: new Date().toISOString().split('T')[0]
            };

            // Actualizar contadores
            this.studentData.completedDeliveries += 1;
            this.studentData.pendingTasks -= 1;

            // Recargar la sección actual
            this.updateSectionContent(this.currentSection);
            
            this.showNotification('Tu entrega ha sido registrada y está en revisión por tu asesor.', 'success');
        }
    }

    // Mostrar detalles de tarea
    showTaskDetails(e) {
        const deliveryItem = e.target.closest('.delivery-item');
        const deliveryId = deliveryItem.getAttribute('data-delivery-id');
        const delivery = this.studentData.upcomingDeliveries.find(d => d.id == deliveryId);
        
        if (delivery) {
            this.showNotification(`Detalles de: ${delivery.title} - ${delivery.description}`, 'info');
        }
    }

    // Editar proyecto
    editProject() {
        this.showNotification('Funcionalidad de edición de proyecto en desarrollo.', 'info');
    }

    // Filtrar entregas
    filterDeliveries() {
        this.showNotification('Filtros aplicados correctamente', 'info');
    }

    // Alternar completado de tarea
    toggleTaskCompletion(checkbox) {
        const taskItem = checkbox.closest('.task-item');
        if (checkbox.checked) {
            taskItem.classList.add('completed');
            this.showNotification('Tarea marcada como completada', 'success');
        } else {
            taskItem.classList.remove('completed');
            this.showNotification('Tarea marcada como pendiente', 'info');
        }
    }

    // Obtener icono para alerta
    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }
    

    // Configurar sistema de notificaciones
    setupNotifications() {
        // Simular notificaciones
        const notifications = [
            { id: 1, message: 'Tienes una nueva retroalimentación', read: false, type: 'info' },
            { id: 2, message: 'Recordatorio: Entrega en 2 días', read: false, type: 'warning' },
            { id: 3, message: 'Tu asesor ha programado una reunión', read: false, type: 'info' }
        ];

        this.updateNotificationBadge(notifications.filter(n => !n.read).length);
    }

    // Actualizar badge de notificaciones
    updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (count > 0) {
                badge.style.display = 'block';
                badge.textContent = count > 9 ? '9+' : count;
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Alternar panel de notificaciones
    toggleNotifications() {
        this.showNotification('Panel de notificaciones en desarrollo. Próximamente podrás ver todas tus notificaciones aquí.', 'info');
    }

    // Mostrar notificación temporal
    showNotification(message, type = 'info') {
        // Eliminar notificación existente si hay una
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Cerrar manualmente
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
    }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new StudentDashboard();
});