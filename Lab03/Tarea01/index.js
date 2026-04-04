const fs = require('fs');

fs.readFile('texto.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer:', err.message);
    return;
  }

  const resultado = data.toUpperCase();

  fs.writeFile('texto_mayusculas.txt', resultado, (err) => {
    if (err) {
      console.error('Error al escribir:', err.message);
      return;
    }

    console.log('Archivo creado exitosamente');
  });
});