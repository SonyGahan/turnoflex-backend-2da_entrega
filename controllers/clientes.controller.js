const Cliente = require('../models/Cliente');

exports.obtenerTodos = async (req, res, next) => {
    try {
        const clientes = await Cliente.find().sort({ id: 1 });
        res.status(200).json(clientes);
    } catch (error) {
        next(error);
    }
};

exports.obtenerPorId = async (req, res, next) => {
    try {
        const cliente = await Cliente.findOne({ id: Number(req.params.id) });
        if (!cliente) {
            return res.status(404).json({ error: "No encontrado", detalle: "Cliente no registrado." });
        }
        res.status(200).json(cliente);
    } catch (error) {
        next(error);
    }
};

exports.crear = async (req, res, next) => {
    try {
        const { nombre, apellido, dni, email, telefono, password, rol } = req.body;
        if (!nombre || !apellido || !dni || !email) {
            return res.status(400).json({ error: "Datos incompletos", detalle: "Nombre, apellido, DNI y email son obligatorios." });
        }

        const ultimo = await Cliente.findOne().sort({ id: -1 });
        const nuevoId = (ultimo && ultimo.id) ? ultimo.id + 1 : 1;

        const nuevoCliente = await Cliente.create({
            id: nuevoId,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            dni: dni.trim(),
            email: email.toLowerCase().trim(),
            telefono: telefono ? telefono.trim() : "",
            password: password || '123456',
            rol: rol || 'cliente'
        });

        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: nuevoCliente });
    } catch (error) {
        next(error);
    }
};

exports.actualizar = async (req, res, next) => {
    try {
        const actualizado = await Cliente.findOneAndUpdate(
            { id: Number(req.params.id) },
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizado) {
            return res.status(404).json({ error: "No encontrado", detalle: "Cliente no encontrado para actualizar." });
        }
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

exports.eliminar = async (req, res, next) => {
    try {
        const eliminado = await Cliente.findOneAndDelete({ id: Number(req.params.id) });
        if (!eliminado) {
            return res.status(404).json({ error: "No encontrado", detalle: "Cliente no encontrado para eliminar." });
        }
        res.status(200).json({ mensaje: "Cliente eliminado correctamente." });
    } catch (error) {
        next(error);
    }
};