import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';  // Importar el middleware cors
import rutas from '../src/router/rutas.mjs';
import multer from 'multer';

const app = express();
const server = http.createServer(app);

// Habilitar CORS para permitir solicitudes de cualquier origen (si quieres permitir solo ciertos orígenes, ajusta esto)
app.use(cors(
    {
        origin: ['http://localhost:8080', 'http://localhost:5000'],  // Permitir el frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Permitir cookies y autenticación
      }
));

// Middleware para manejar OPTIONS

app.options('*', cors()); 

// Si solo quieres permitir solicitudes desde tu frontend específico, usa algo como esto:
// app.use(cors({ origin: 'http://localhost:8080' }));

// Otros middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true })); // ¡IMPORTANTE!
app.use(express.json());
app.use(rutas);

/*const upload = multer({ dest: 'uploads/'});
app.use(upload.single('archivo'));*/

// Ruta raíz
app.get('/', (req, res) => {
    res.send("Servidor en Marcha");
});

app.use('/uploads', express.static('uploads'));

// Configura el puerto y comienza a escuchar
app.set('port', process.env.PORT || 5000);
server.listen(app.get('port'), () => {
    console.log("Servidor corriendo en el puerto ...", app.get('port'));
});

// Conectar a MongoDB
mongoose.connect('mongodb://root:abc123@localhost:27017/bbdd?authSource=admin')
    .then(db => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));
