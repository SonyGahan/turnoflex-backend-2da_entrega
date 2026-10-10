const Cliente = require('../models/Cliente');

exports.mostrarLogin = (req, res) => {
    if (req.session && req.session.usuario) {
        return res.redirect(req.session.usuario.rol === 'empleado' ? '/vista/turnos' : '/mis-turnos');
    }
    res.render('login', { error: null });
};

exports.procesarLogin = async (req, res, next) => {
    try {
        const { identificador, password } = req.body;
        if (!identificador || !password) {
            return res.render('login', {
                error: 'Por favor complete su correo electrónico/DNI y contraseña.'
            });
        }
        const termino = String(identificador).trim();
        const usuario = await Cliente.findOne({
            $or: [
                { email: termino.toLowerCase() },
                { dni: termino }
            ],
            password: String(password).trim()
        });

        if (!usuario) {
            return res.render('login', {
                error: 'Credenciales inválidas. Verifique sus datos e intente nuevamente.'
            });
        }

        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            dni: usuario.dni,
            rol: usuario.rol
        };

        if (usuario.rol === 'empleado') {
            return res.redirect('/vista/turnos');
        } else {
            return res.redirect('/mis-turnos');
        }
    } catch (error) {
        next(error);
    }
};

exports.mostrarRegistro = (req, res) => {
    if (req.session && req.session.usuario) {
        return res.redirect(req.session.usuario.rol === 'empleado' ? '/vista/turnos' : '/mis-turnos');
    }
    res.render('registro', { error: null, valores: {} });
};

exports.procesarRegistro = async (req, res, next) => {
    try {
        const { nombre, apellido, dni, email, telefono, password } = req.body;

        if (!nombre || !apellido || !dni || !email || !password) {
            return res.render('registro', {
                error: 'Todos los campos obligatorios deben ser completados.',
                valores: req.body
            });
        }
        if (password.length < 4) {
            return res.render('registro', {
                error: 'La contraseña debe tener al menos 4 caracteres.',
                valores: req.body
            });
        }

        const existente = await Cliente.findOne({
            $or: [
                { email: email.toLowerCase().trim() },
                { dni: dni.trim() }
            ]
        });

        if (existente) {
            return res.render('registro', {
                error: 'Ya existe un usuario registrado con ese DNI o correo electrónico.',
                valores: req.body
            });
        }

        const ultimo = await Cliente.findOne().sort({ id: -1 });
        const nuevoId = (ultimo && ultimo.id) ? ultimo.id + 1 : 1;

        const nuevoCliente = await Cliente.create({
            id: nuevoId,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            dni: dni.trim(),
            email: email.toLowerCase().trim(),
            telefono: telefono ? telefono.trim() : '',
            password: password,
            rol: 'cliente'
        });

        req.session.usuario = {
            id: nuevoCliente.id,
            nombre: nuevoCliente.nombre,
            apellido: nuevoCliente.apellido,
            email: nuevoCliente.email,
            dni: nuevoCliente.dni,
            rol: nuevoCliente.rol
        };

        res.redirect('/mis-turnos');
    } catch (error) {
        next(error);
    }
};

exports.cerrarSesion = (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};