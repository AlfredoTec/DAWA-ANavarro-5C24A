const fs = require('fs');
const readable = fs.createReadStream('datos.txt', { encoding: 'utf8' });
const zlib = require('zlib');
const writable = fs.createWriteStream('salida.txt');

// Actividad 1: Lectura de un Archivo usando Streams
readable.on('data', chunk => console.log('Fragmento recibido:', chunk));
readable.on('end', () => console.log('Lectura completa'));
readable.on('error', err => console.log('Error:', err));
/*
*/

// Actividad 2: Escritura en un Archivo usando Streams
writable.write('Este es un mensaje de prueba.\n');
writable.end('Fin del mensaje.');
writable.on('finish', () => console.log('Escritura completada.'));
/*
*/

// Actividad 3: Compresión con Pipes
const readStream = fs.createReadStream('entrada.txt');
const writeStream = fs.createWriteStream('entrada.txt.gz');
const gzip = zlib.createGzip();
readStream.pipe(gzip).pipe(writeStream);
/*
*/

// Actividad 4: Manejo de Errores y Backpressure
readable.on('data', chunk => {
    if (!writable.write(chunk)) {
        readable.pause();
    }
});

writable.on('drain', () => readable.resume());