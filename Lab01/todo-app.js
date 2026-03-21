// array donde se guardan las tareas
const tareas = [];

// para leer lo que se escribe en la terminal
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function agregarTarea() {
    rl.question('Título: ', (titulo) => {
    rl.question('Descripción: ', (descripcion) => {
      rl.question('Categoría (Estudio/Trabajo/Personal): ', (categoria) => {
        // se le asigna un id basado en la cantidad de tareas + 1
        const id = tareas.length + 1;
        // se crea un objeto que representa una tarea
        const tarea = {
          id,
          titulo,
          descripcion,
          categoria,
          estado: 'pendiente'
        };
        // se agrega la tarea al array de tareas
        tareas.push(tarea);
        console.log('Tarea agregada correctamente.');
        mostrarMenu();
      });
    });
  });
}

function listarTareas(estado) {
  // se filtran las tareas por el estado pasado como parametro
  const filtradas = tareas.filter(t => t.estado === estado);
  // se verifica si hay tareas de un determinado estado
  if (filtradas.length === 0) {
    console.log(`No hay tareas ${estado === 'pendiente' ? 'pendientes' : 'completadas'}.`);
  } else {
    // se recorre el array de tareas filtradas y se muestra cada una
    filtradas.forEach(t => {
      console.log(`#${t.id} [${t.categoria}] - ${t.titulo}: ${t.descripcion}`);
    });
  }
  mostrarMenu();
}

function marcarTareaComoCompletada() {
  // se filtran las tareas pendientes en un array "pendientes"  
  const pendientes = tareas.filter(t => t.estado === 'pendiente');
  if (pendientes.length === 0) {
    console.log('No hay tareas pendientes para marcar.');
    mostrarMenu();
    return;
  }

  // se recorre el array de tareas pendientes y se muestra cada una
  pendientes.forEach(t => {
    console.log(`#${t.id} [${t.categoria}] - ${t.titulo}: ${t.descripcion}`);
  });

  // Se solicita el ID de la tarea a marcar como completada
  rl.question('Ingrese el ID de la tarea a marcar como completada: ', (id) => {
    const tarea = tareas.find(t => t.id === parseInt(id));
    if (tarea && tarea.estado === 'pendiente') {
      // se marca la tarea como completada
      tarea.estado = 'completada';
      console.log('Tarea marcada como completada.');
    } else {
      console.log('ID no válido o tarea ya completada.');
    }
    mostrarMenu();
  });
}

function listarPorCategoria() {
  const categorias = {};
  // se recorre el array de tareas y se agrupan por categoria
  tareas.forEach(t => {
    if (!categorias[t.categoria]) {
      categorias[t.categoria] = [];
    }
    categorias[t.categoria].push(t);
  });

  // se recorre el objeto de categorias y se muestra cada una
  Object.keys(categorias).forEach(cat => {
    console.log(`\nCategoría: ${cat}`);
    categorias[cat].forEach(t => {
      console.log(`#${t.id} [${t.estado}] - ${t.titulo}: ${t.descripcion}`);
    });
  });
  if (Object.keys(categorias).length === 0) {
    console.log('No hay tareas registradas.');
  }
  mostrarMenu();
}

function mostrarMenu() {
  console.log('\n--- Gestor de Tareas ---');
  console.log('1. Agregar tarea');
  console.log('2. Listar tareas pendientes');
  console.log('3. Listar tareas completadas');
  console.log('4. Marcar tarea como completada');
  console.log('5. Listar tareas por categoría');
  console.log('6. Salir');
  rl.question('Seleccione una opción: ', (opcion) => {
    switch(opcion) {
      case '1': agregarTarea(); break;
      case '2': listarTareas('pendiente'); break;
      case '3': listarTareas('completada'); break;
      case '4': marcarTareaComoCompletada(); break;
      case '5': listarPorCategoria(); break;
      case '6': rl.close(); break;
      default:
        console.log('Opción no válida.');
        mostrarMenu();
    }
  });
}

mostrarMenu();
