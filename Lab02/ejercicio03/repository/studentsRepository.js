let students = [
  {
    id: 1,
    name: "María García",
    grade: 18,
    age: 22,
    email: "maria.garcia@ejemplo.com",
    phone: "+51 987654322",
    enrollmentNumber: "2025002",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programación Web", "Matemáticas", "Inglés"],
    gpa: 3.5,
    status: "Activo",
    admissionDate: "2023-02-15"
  },
  {
    id: 2,
    name: "Carlos López",
    grade: 19,
    age: 24,
    email: "carlos.lopez@ejemplo.com",
    phone: "+51 987654323",
    enrollmentNumber: "2025003",
    course: "Diseño y Desarrollo de Software C24",
    year: 4,
    subjects: ["Inteligencia Artificial", "Gestión de Proyectos", "Desarrollo Móvil"],
    gpa: 3.9,
    status: "Activo",
    admissionDate: "2021-08-20"
  },
  {
    id: 3,
    name: "Ana Torres",
    grade: 20,
    age: 21,
    email: "ana.torres@ejemplo.com",
    phone: "+51 987654324",
    enrollmentNumber: "2025004",
    course: "Diseño y Desarrollo de Software C24",
    year: 1,
    subjects: ["Introducción a la Programación", "Fundamentos de Diseño", "Comunicación"],
    gpa: 4.0,
    status: "Activo",
    admissionDate: "2024-01-10"
  },
  {
    id: 4,
    name: "Luis Mendoza",
    grade: 14,
    age: 23,
    email: "luis.mendoza@ejemplo.com",
    phone: "+51 987654325",
    enrollmentNumber: "2025005",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Bases de Datos", "Ingeniería de Software"],
    gpa: 3.2,
    status: "Activo",
    admissionDate: "2022-03-01"
  },
  {
    id: 5,
    name: "Patricia Flores",
    grade: 11,
    age: 20,
    email: "patricia.flores@ejemplo.com",
    phone: "+51 987654326",
    enrollmentNumber: "2025006",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programación Web", "Matemáticas"],
    gpa: 2.8,
    status: "Inactivo",
    admissionDate: "2023-08-10"
  },
  {
    id: 6,
    name: "Jorge Ríos",
    grade: 17,
    age: 25,
    email: "jorge.rios@ejemplo.com",
    phone: "+51 987654327",
    enrollmentNumber: "2025007",
    course: "Diseño y Desarrollo de Software C24",
    year: 5,
    subjects: ["Proyecto de Tesis", "Gestión de Proyectos"],
    gpa: 3.7,
    status: "Egresado",
    admissionDate: "2020-02-20"
  },
  {
    id: 7,
    name: "Claudia Núñez",
    grade: 8,
    age: 22,
    email: "claudia.nunez@ejemplo.com",
    phone: "+51 987654328",
    enrollmentNumber: "2025008",
    course: "Diseño y Desarrollo de Software C24",
    year: 1,
    subjects: ["Introducción a la Programación", "Comunicación"],
    gpa: 2.0,
    status: "Inactivo",
    admissionDate: "2024-01-15"
  },
  {
    id: 8,
    name: "Ricardo Soto",
    grade: 16,
    age: 24,
    email: "ricardo.soto@ejemplo.com",
    phone: "+51 987654329",
    enrollmentNumber: "2025009",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Desarrollo Móvil", "Bases de Datos"],
    gpa: 3.3,
    status: "Activo",
    admissionDate: "2022-09-05"
  },
  {
    id: 9,
    name: "Andrea Paz",
    grade: 13,
    age: 21,
    email: "andrea.paz@ejemplo.com",
    phone: "+51 987654330",
    enrollmentNumber: "2025010",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programación Web", "Matemáticas"],
    gpa: 3.0,
    status: "Activo",
    admissionDate: "2023-07-18"
  },
  {
    id: 10,
    name: "Fernando Castro",
    grade: 19,
    age: 26,
    email: "fernando.castro@ejemplo.com",
    phone: "+51 987654331",
    enrollmentNumber: "2025011",
    course: "Diseño y Desarrollo de Software C24",
    year: 5,
    subjects: ["Inteligencia Artificial", "Proyecto de Tesis"],
    gpa: 3.8,
    status: "Egresado",
    admissionDate: "2019-03-10"
  }
];

let nextId = 4;

// Función para validar campos obligatorios
function validateStudent(student) {
  const requiredFields = ['name', 'email', 'course', 'phone'];
  const missing = requiredFields.filter(field => !student[field] || student[field].trim() === '');
  if (missing.length > 0) {
    throw new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
  }
  return true;
}

// Obtener todos los estudiantes
function getAll() {
  return students;
}

// Obtener estudiante por ID
function getById(id) {
  return students.find(s => s.id === id);
}

// Crear nuevo estudiante
function create(studentData) {
  validateStudent(studentData);
  const newStudent = {
    id: nextId++,
    ...studentData,
    // Si no se envían algunos campos opcionales, asignar valores por defecto
    grade: studentData.grade || null,
    age: studentData.age || null,
    enrollmentNumber: studentData.enrollmentNumber || `AUTO-${nextId}`,
    year: studentData.year || 1,
    subjects: studentData.subjects || [],
    gpa: studentData.gpa || 0,
    status: studentData.status || "Activo",
    admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0]
  };
  students.push(newStudent);
  return newStudent;
}

// Actualizar estudiante por ID
function update(id, studentData) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  // Validar solo los campos obligatorios si están presentes en la actualización
  if (studentData.name !== undefined || studentData.email !== undefined || 
      studentData.course !== undefined || studentData.phone !== undefined) {
    const partial = {
      name: studentData.name !== undefined ? studentData.name : students[index].name,
      email: studentData.email !== undefined ? studentData.email : students[index].email,
      course: studentData.course !== undefined ? studentData.course : students[index].course,
      phone: studentData.phone !== undefined ? studentData.phone : students[index].phone
    };
    validateStudent(partial);
  }

  const updatedStudent = {
    ...students[index],
    ...studentData,
    id // mantener el mismo id
  };
  students[index] = updatedStudent;
  return updatedStudent;
}

// Eliminar estudiante por ID
function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
}

// Filtrar por estado (status)
function listByStatus(status) {
  return students.filter(s => s.status === status);
}

// Filtrar por promedio (grade) - se puede usar operadores >, <, >=, <=, =
function listByGrade(operator, value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('El valor del promedio debe ser un número');
  }
  switch (operator) {
    case '>':
      return students.filter(s => s.grade > value);
    case '<':
      return students.filter(s => s.grade < value);
    case '>=':
      return students.filter(s => s.grade >= value);
    case '<=':
      return students.filter(s => s.grade <= value);
    case '=':
      return students.filter(s => s.grade === value);
    default:
      throw new Error('Operador no válido. Use >, <, >=, <=, =');
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  listByStatus,
  listByGrade
};