const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');

// Configuración de Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Conectar a la base de datos
const db = new sqlite3.Database('cotizaciones.db', (err) => {
    if (err) console.error('Error al conectar a la base de datos:', err);
    else console.log('Conectado a la base de datos');
});

// Crear tablas
db.serialize(() => {
    // Tabla de cámaras
    db.run(`CREATE TABLE IF NOT EXISTS cameras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT,
        mp INTEGER,
        usage TEXT,
        material TEXT,
        type TEXT,
        ir_color TEXT,
        audio TEXT,
        ir_range INTEGER,
        connection TEXT,
        ai TEXT,
        price TEXT
    )`);

    // Tabla de grabadores
    db.run(`CREATE TABLE IF NOT EXISTS recorders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT,
        channels INTEGER,
        resolution TEXT,
        technology TEXT,
        price TEXT
    )`);

    // Tabla de costos de instalación
    db.run(`CREATE TABLE IF NOT EXISTS installation_costs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        condition TEXT,
        price TEXT
    )`);

    // Tabla de accesorios
    db.run(`CREATE TABLE IF NOT EXISTS accessories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price TEXT
    )`);

    // Tabla de cables
    db.run(`CREATE TABLE IF NOT EXISTS cables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        category TEXT,
        price_per_meter TEXT
    )`);

    // Tabla de protección de cables
    db.run(`CREATE TABLE IF NOT EXISTS cable_protection (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        capacity TEXT,
        price_per_2m TEXT
    )`);

    // Tabla de clientes
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        id_number TEXT,
        phone TEXT,
        address TEXT,
        email TEXT
    )`);

    // Tabla de cotizaciones
    db.run(`CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        customer_id INTEGER,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )`);

    // Tabla de ítems de cotización
    db.run(`CREATE TABLE IF NOT EXISTS quote_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_id INTEGER,
        item_type TEXT,
        item_id INTEGER,
        quantity INTEGER,
        FOREIGN KEY (quote_id) REFERENCES quotes(id)
    )`);

    // Tabla de información de la empresa
    db.run(`CREATE TABLE IF NOT EXISTS company_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        date TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        website TEXT
    )`);

    // Insertar datos iniciales de la empresa si no existen
    db.get('SELECT * FROM company_info WHERE id = 1', (err, row) => {
        if (!row) {
            db.run(
                'INSERT INTO company_info (city, date, name, phone, email, website) VALUES (?, ?, ?, ?, ?, ?)',
                ['Zipaquirá', '27 de febrero de 2025', 'Cotizaciones de Seguridad XYZ', '(123) 456-7890', 'info@seguridadxyz.com', 'www.seguridadxyz.com']
            );
        }
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
});

// Ruta: Dashboard
app.get('/', (req, res) => {
    res.render('dashboard');
});

// Rutas de gestión (ejemplo para cámaras, replicar para otras tablas)
app.get('/manage_cameras', (req, res) => {
    db.all('SELECT * FROM cameras', (err, cameras) => {
        if (err) throw err;
        res.render('manage_cameras', { cameras: cameras || [] });
    });
});

app.post('/manage_cameras', (req, res) => {
    const { model, mp, usage, material, type, ir_color, audio, ir_range, connection, ai, price } = req.body;
    db.run(
        'INSERT INTO cameras (model, mp, usage, material, type, ir_color, audio, ir_range, connection, ai, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [model, mp, usage, material, type, ir_color, audio, ir_range, connection, ai, price],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_cameras');
        }
    );
});

// Rutas de gestión para grabadores
app.get('/manage_recorders', (req, res) => {
    db.all('SELECT * FROM recorders', (err, recorders) => {
        if (err) throw err;
        res.render('manage_recorders', { recorders: recorders || [] });
    });
});

app.post('/manage_recorders', (req, res) => {
    const { model, channels, resolution, technology, price } = req.body;
    db.run(
        'INSERT INTO recorders (model, channels, resolution, technology, price) VALUES (?, ?, ?, ?, ?)',
        [model, channels, resolution, technology, price],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_recorders');
        }
    );
});

// Rutas de gestión para costos de instalación
app.get('/manage_installation', (req, res) => {
    db.all('SELECT * FROM installation_costs', (err, installation_costs) => {
        if (err) throw err;
        res.render('manage_installation', { installation_costs: installation_costs || [] });
    });
});

app.post('/manage_installation', (req, res) => {
    const { condition, price } = req.body;
    db.run(
        'INSERT INTO installation_costs (condition, price) VALUES (?, ?)',
        [condition, price],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_installation');
        }
    );
});

// Rutas de gestión para accesorios
app.get('/manage_accessories', (req, res) => {
    db.all('SELECT * FROM accessories', (err, accessories) => {
        if (err) throw err;
        res.render('manage_accessories', { accessories: accessories || [] });
    });
});

app.post('/manage_accessories', (req, res) => {
    const { name, price } = req.body;
    db.run(
        'INSERT INTO accessories (name, price) VALUES (?, ?)',
        [name, price],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_accessories');
        }
    );
});

// Rutas de gestión para cables
app.get('/manage_cables', (req, res) => {
    db.all('SELECT * FROM cables', (err, cables) => {
        if (err) throw err;
        res.render('manage_cables', { cables: cables || [] });
    });
});

app.post('/manage_cables', (req, res) => {
    const { type, category, price_per_meter } = req.body;
    db.run(
        'INSERT INTO cables (type, category, price_per_meter) VALUES (?, ?, ?)',
        [type, category, price_per_meter],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_cables');
        }
    );
});

// Rutas de gestión para protección de cables
app.get('/manage_protection', (req, res) => {
    db.all('SELECT * FROM cable_protection', (err, cable_protection) => {
        if (err) throw err;
        res.render('manage_protection', { cable_protection: cable_protection || [] });
    });
});

app.post('/manage_protection', (req, res) => {
    const { type, capacity, price_per_2m } = req.body;
    db.run(
        'INSERT INTO cable_protection (type, capacity, price_per_2m) VALUES (?, ?, ?)',
        [type, capacity, price_per_2m],
        (err) => {
            if (err) throw err;
            res.redirect('/manage_protection');
        }
    );
});

// Ruta: Crear Cotización
app.get('/create_quote', (req, res) => {
    db.all('SELECT * FROM cameras', (err, cameras) => {
        if (err) throw err;
        db.all('SELECT * FROM recorders', (err, recorders) => {
            if (err) throw err;
            db.all('SELECT * FROM installation_costs', (err, installation_costs) => {
                if (err) throw err;
                db.all('SELECT * FROM accessories', (err, accessories) => {
                    if (err) throw err;
                    db.all('SELECT * FROM cables', (err, cables) => {
                        if (err) throw err;
                        db.all('SELECT * FROM cable_protection', (err, protection) => {
                            if (err) throw err;
                            db.all('SELECT * FROM customers', (err, customers) => {
                                if (err) throw err;
                                res.render('create_quote', {
                                    cameras, recorders, installation_costs, accessories, cables, protection, customers
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.post('/create_quote', (req, res) => {
    const { customer_id, new_customer_name, new_customer_id_number, new_customer_phone, new_customer_address, new_customer_email,
            cameras, recorders, installation_costs, accessories, cables, cable_protection, quantities } = req.body;
    const date = new Date().toLocaleDateString('es-ES');

    let finalCustomerId;
    if (customer_id) {
        finalCustomerId = customer_id;
    } else {
        db.run(
            'INSERT INTO customers (name, id_number, phone, address, email) VALUES (?, ?, ?, ?, ?)',
            [new_customer_name, new_customer_id_number || null, new_customer_phone, new_customer_address || null, new_customer_email || null],
            function (err) {
                if (err) throw err;
                finalCustomerId = this.lastID;
                createQuote(finalCustomerId);
            }
        );
        return;
    }
    createQuote(finalCustomerId);

    function createQuote(customerId) {
        db.run('INSERT INTO quotes (date, customer_id) VALUES (?, ?)', [date, customerId], function (err) {
            if (err) throw err;
            const quoteId = this.lastID;
            const items = [];

            // Agregar ítems seleccionados
            if (cameras) cameras.forEach((id, i) => items.push([quoteId, 'camera', id, quantities.cameras[i] || 1]));
            if (recorders) recorders.forEach((id, i) => items.push([quoteId, 'recorder', id, quantities.recorders[i] || 1]));
            if (installation_costs) installation_costs.forEach((id, i) => items.push([quoteId, 'installation', id, quantities.installation_costs[i] || 1]));
            if (accessories) accessories.forEach((id, i) => items.push([quoteId, 'accessory', id, quantities.accessories[i] || 1]));
            if (cables) cables.forEach((id, i) => items.push([quoteId, 'cable', id, quantities.cables[i] || 1]));
            if (cable_protection) cable_protection.forEach((id, i) => items.push([quoteId, 'protection', id, quantities.cable_protection[i] || 1]));

            if (items.length === 0) return res.status(400).send('Selecciona al menos un ítem');

            db.run(
                `INSERT INTO quote_items (quote_id, item_type, item_id, quantity) VALUES ${items.map(() => '(?, ?, ?, ?)').join(',')}`,
                items.flat(),
                (err) => {
                    if (err) throw err;
                    res.redirect(`/quote/${quoteId}`);
                }
            );
        });
    }
});

// Ruta: Ver Cotización
app.get('/quote/:id', (req, res) => {
    const quoteId = req.params.id;
    db.get('SELECT q.*, c.* FROM quotes q JOIN customers c ON q.customer_id = c.id WHERE q.id = ?', [quoteId], (err, quote) => {
        if (err || !quote) return res.status(404).send('Cotización no encontrada');
        db.all(
            `SELECT qi.item_type, qi.quantity, 
                    c.model AS camera_model, c.price AS camera_price,
                    r.model AS recorder_model, r.price AS recorder_price,
                    ic.condition AS installation_condition, ic.price AS installation_price,
                    a.name AS accessory_name, a.price AS accessory_price,
                    cb.type AS cable_type, cb.price_per_meter AS cable_price,
                    cp.type AS protection_type, cp.price_per_2m AS protection_price
             FROM quote_items qi
             LEFT JOIN cameras c ON qi.item_type = 'camera' AND qi.item_id = c.id
             LEFT JOIN recorders r ON qi.item_type = 'recorder' AND qi.item_id = r.id
             LEFT JOIN installation_costs ic ON qi.item_type = 'installation' AND qi.item_id = ic.id
             LEFT JOIN accessories a ON qi.item_type = 'accessory' AND qi.item_id = a.id
             LEFT JOIN cables cb ON qi.item_type = 'cable' AND qi.item_id = cb.id
             LEFT JOIN cable_protection cp ON qi.item_type = 'protection' AND qi.item_id = cp.id
             WHERE qi.quote_id = ?`,
            [quoteId],
            (err, items) => {
                if (err) throw err;
                db.get('SELECT * FROM company_info WHERE id = 1', (err, company) => {
                    if (err) throw err;
                    res.render('view_quote', { quote, items, company });
                });
            }
        );
    });
});

// Ruta: Lista de Cotizaciones
app.get('/quotes', (req, res) => {
    db.all(
        `SELECT q.id, q.date, c.name 
         FROM quotes q 
         JOIN customers c ON q.customer_id = c.id 
         ORDER BY q.id DESC`, 
        (err, quotes) => {
            if (err) throw err;
            res.render('quotes_list', { quotes: quotes || [] });
        }
    );
});

// Ruta: Gestión de información de la empresa
app.get('/company_info', (req, res) => {
    db.get('SELECT * FROM company_info WHERE id = 1', (err, company) => {
        if (err) throw err;
        res.render('company_info', { company });
    });
});

app.post('/company_info', (req, res) => {
    const { city, date, name, phone, email, website } = req.body;
    db.run(
        'UPDATE company_info SET city = ?, date = ?, name = ?, phone = ?, email = ?, website = ? WHERE id = 1',
        [city, date, name, phone, email, website],
        (err) => {
            if (err) throw err;
            res.redirect('/company_info');
        }
    );
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
