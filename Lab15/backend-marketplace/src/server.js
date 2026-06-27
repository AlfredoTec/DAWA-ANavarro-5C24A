require('dotenv').config();
const app = require('./app');
const { sequelize, Role, Category, User } = require('./models');

const PORT = process.env.PORT || 3001;

async function seed() {
  const roles = await Role.findAll();
  if (roles.length === 0) {
    await Role.bulkCreate([
      { nombre: 'ADMIN' },
      { nombre: 'CUSTOMER' },
    ]);
    console.log('Roles creados: ADMIN, CUSTOMER');
  }

  const categories = await Category.findAll();
  if (categories.length === 0) {
    await Category.bulkCreate([
      { nombre: 'Electronica' },
      { nombre: 'Ropa' },
      { nombre: 'Hogar' },
      { nombre: 'Deportes' },
    ]);
    console.log('Categorias creadas');
  }

  const adminExists = await User.findOne({ where: { email: 'admin@market.com' } });
  if (!adminExists) {
    await User.create({
      nombre: 'Admin',
      email: 'admin@market.com',
      password: 'admin123',
      roleId: 1,
    });
    console.log('Usuario admin creado: admin@market.com / admin123');
  }
}

sequelize.sync({ alter: true }).then(async () => {
  await seed();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('Error al conectar con la base de datos:', error);
});
