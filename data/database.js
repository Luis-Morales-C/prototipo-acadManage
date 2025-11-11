// Servicio de datos simulados
class DataService {
    static initialize() {
        // Inicializar datos en localStorage si no existen
        if (!localStorage.getItem('acadmanage_data')) {
            const initialData = {
                projects: [
                    {
                        id: 1,
                        title: 'Sistema de Gestión Académica para IES',
                        student: 'Juan Pérez',
                        advisor: 'María González',
                        startDate: '2024-08-15',
                        endDate: '2025-05-30',
                        progress: 67,
                        status: 'En Desarrollo',
                        priority: 'medium'
                    },
                    {
                        id: 2,
                        title: 'Aplicación Móvil para Gestión de Inventarios',
                        student: 'Ana Martínez',
                        advisor: 'María González',
                        startDate: '2024-08-20',
                        endDate: '2025-06-15',
                        progress: 42,
                        status: 'Con Retraso',
                        priority: 'high'
                    }
                ],
                tasks: [
                    {
                        id: 1,
                        title: 'Revisar Marco Teórico',
                        projectId: 1,
                        assignedTo: 'María González',
                        dueDate: '2024-12-20',
                        status: 'pending',
                        priority: 'high'
                    }
                ],
                users: [
                    {
                        id: 1,
                        name: 'María González',
                        email: 'maria@universidad.edu',
                        role: 'profesor',
                        department: 'Sistemas'
                    }
                ]
            };
            localStorage.setItem('acadmanage_data', JSON.stringify(initialData));
        }
    }

    static getData() {
        return JSON.parse(localStorage.getItem('acadmanage_data') || '{}');
    }

    static saveData(data) {
        localStorage.setItem('acadmanage_data', JSON.stringify(data));
    }

    static getProfessorProjects() {
        const data = this.getData();
        return data.projects || [];
    }

    static getPendingDeliveries() {
        // Simular entregas pendientes
        return [
            {
                id: 1,
                title: 'Juan Pérez - Marco Teórico',
                project: 'Sistema de Gestión Académica',
                submitted: '2024-12-18',
                status: 'pending'
            },
            {
                id: 2,
                title: 'Ana Martínez - Avance Capítulo 3',
                project: 'Aplicación Móvil Inventarios',
                submitted: '2024-12-15',
                status: 'pending'
            }
        ];
    }

    static getCriticalProjects() {
        const projects = this.getProfessorProjects();
        return projects.filter(project => project.priority === 'high');
    }

    static getAnalyticsData() {
        return {
            averageProgress: 67,
            trend: '+8%',
            monthlyData: [45, 52, 58, 67]
        };
    }

    // Método para agregar nuevo proyecto
    static addProject(projectData) {
        const data = this.getData();
        const newProject = {
            id: Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
        
        data.projects = data.projects || [];
        data.projects.push(newProject);
        this.saveData(data);
        
        return newProject;
    }

    // Método para actualizar progreso de proyecto
    static updateProjectProgress(projectId, progress) {
        const data = this.getData();
        const project = data.projects.find(p => p.id === projectId);
        
        if (project) {
            project.progress = progress;
            project.updatedAt = new Date().toISOString();
            this.saveData(data);
            return project;
        }
        
        return null;
    }
}