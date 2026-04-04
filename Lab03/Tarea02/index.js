
const http = require('http');
const ExcelJS = require('exceljs');

const datosVentas = [
  { producto: 'Laptop Dell XPS',       cantidad: 5,  precio: 1299.99 },
  { producto: 'Mouse Logitech MX',     cantidad: 20, precio: 49.99  },
  { producto: 'Teclado Mecánico',      cantidad: 15, precio: 89.99  },
  { producto: 'Monitor 27" 4K',        cantidad: 8,  precio: 399.99 },
  { producto: 'Auriculares Sony',      cantidad: 12, precio: 149.99 },
  { producto: 'Webcam HD 1080p',       cantidad: 18, precio: 79.99  },
  { producto: 'Hub USB-C 7 puertos',   cantidad: 25, precio: 39.99  },
  { producto: 'SSD 1TB Samsung',       cantidad: 10, precio: 109.99 },
  { producto: 'RAM 16GB DDR5',         cantidad: 14, precio: 74.99  },
  { producto: 'Tarjeta Gráfica RTX',   cantidad: 3,  precio: 799.99 },
  { producto: 'Silla Ergonómica',      cantidad: 6,  precio: 349.99 },
  { producto: 'Escritorio Ajustable',  cantidad: 4,  precio: 499.99 },
  { producto: 'Lámpara LED USB',       cantidad: 30, precio: 19.99  },
  { producto: 'Cable HDMI 2.1',        cantidad: 40, precio: 14.99  },
  { producto: 'Mousepad XL',           cantidad: 22, precio: 24.99  },
  { producto: 'Soporte para Laptop',   cantidad: 17, precio: 34.99  },
  { producto: 'Cámara IP Seguridad',   cantidad: 9,  precio: 129.99 },
  { producto: 'Router WiFi 6',         cantidad: 7,  precio: 189.99 },
  { producto: 'Impresora Laser',       cantidad: 5,  precio: 259.99 },
  { producto: 'Tablet Android 10"',    cantidad: 11, precio: 229.99 },
  { producto: 'Cargador Inalámbrico',  cantidad: 35, precio: 29.99  },
  { producto: 'Disco Duro Externo 2TB',cantidad: 13, precio: 89.99  },
];

// Función para generar el Excel y enviarlo en streaming
async function generarYEnviarExcel(res) {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,       // Escribir directamente al response (streaming)
    useStyles: true,
  });

  const hoja = workbook.addWorksheet('Ventas');

  // Definir columnas con cabeceras
  hoja.columns = [
    { header: 'Producto',  key: 'producto', width: 30 },
    { header: 'Cantidad',  key: 'cantidad', width: 12 },
    { header: 'Precio',    key: 'precio',   width: 14 },
  ];

  // Estilo para la fila de cabecera
  hoja.getRow(1).font = { bold: true };
  hoja.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' },
  };
  hoja.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  hoja.getRow(1).commit();

  // Agregar filas de datos
  for (const item of datosVentas) {
    const fila = hoja.addRow(item);
    fila.commit(); // Importante en streaming: confirmar cada fila
  }

  // Cerrar la hoja y el workbook para finalizar el stream
  await hoja.commit();
  await workbook.commit();
}

// Crear el servidor HTTP
const servidor = http.createServer(async (req, res) => {
  if (req.url === '/reporte') {
    // Configurar cabeceras HTTP para forzar descarga del archivo .xlsx
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      'attachment; filename="reporte_ventas.xlsx"');

    try {
      await generarYEnviarExcel(res);
      res.statusCode(200);
      console.log('Reporte Excel enviado correctamente.');
    } catch (err) {
      // Si el encabezado aún no fue enviado, responder con error 500
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end('Error al generar el reporte Excel.');
      console.error('Error al generar el Excel:', err.message);
    }

  } else {
    // Cualquier otra ruta devuelve mensaje orientativo
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Visita /reporte para descargar el Excel');
  }
});

// Iniciar el servidor en el puerto 3000
servidor.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  console.log('Descargar Excel en http://localhost:3000/reporte');
});