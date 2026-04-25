import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1); // opcional: cierra la app si falla
  }
};

export default connectDB;