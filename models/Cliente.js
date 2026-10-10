const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    dni: {
        type: String,
        required: [true, 'El DNI es obligatorio'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true,
        default: ''
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        default: '123456'
    },
    rol: {
        type: String,
        enum: ['cliente', 'empleado'],
        default: 'cliente'
    },
    fechaAlta: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);