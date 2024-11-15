import Eventos from '../models/events.js';
import moment from 'moment';
import mongoose from 'mongoose';

export const createEvent = async (req, res) => {
    try {
        const { name, dateTime, description, guests, price, location, status } = req.body;

        // Validar campos requeridos
        if (!name || !dateTime || price === undefined || !location) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Crear el evento
        const newEvent = new Eventos({
            name,
            dateTime,
            description,
            guests,
            price,
            location,
            status: 'active'
        });

        // Guardar el evento en la base de datos
        await newEvent.save();

        res.status(201).json({ message: 'Evento creado exitosamente', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el evento', error: error.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { dateTime: -1 } // Ordenar por fecha más reciente
        };

        const events = await Eventos.paginate({}, options);
        const formattedEvents = events.docs.map(event => {
            const formattedDate = moment(event.dateTime).format('MMMM Do YYYY, h:mm:ss a');
            return {
                ...event.toObject(),
                dateTime: formattedDate
            };
        });

        res.status(200).json({ ...events, docs: formattedEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los eventos', error: error.message });
    }
};
// Obtener un evento por ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID no válido' });
        }
        const event = await Eventos.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        const formattedDate = moment(event.dateTime).format('MMMM Do YYYY, h:mm:ss a');
        const formattedEvent = {
            ...event.toObject(),
            dateTime: formattedDate
        };
        res.status(200).json(formattedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error: error.message });
    }
};

// Cambiar el estado de un evento
export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

      
        const event = await Eventos.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.status(200).json({ message: 'Estado del evento actualizado', event });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send({ message: "Invalid Id" });
        }
        
        res.status(500).json({ message: 'Error al actualizar el estado del evento', error: error.message });
    }
};

export const getEventsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        // Validar el estado proporcionado
        const validStatuses = ['active', 'inactive', 'canceled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }
        //validar que haya uno con status y si no lo hay mostrar un mensaje de "vacio"
        const eventCount = await Eventos.countDocuments({ status });
        if (eventCount === 0) {
            return res.status(200).json({ message: 'No hay eventos con el estado proporcionado' });
        }

        // Buscar eventos por estado
        const events = await Eventos.find({ status });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los eventos', error: error.message });
    }
};

export const confirmAttendance  = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Eventos.findByIdAndUpdate(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.statusAssist += 1;
        await event.save();

        res.status(200).json({ message: 'Attendance confirmed', event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};

export const decreaseAttendance = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Eventos.findByIdAndUpdate(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.statusAssist > 0) {
            event.statusAssist -= 1;
        }
        await event.save();

        res.status(200).json({ message: 'Attendance decreased', event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};


export const getEventsByDate = async (req, res) => {
    try {
        const { date } = req.params;

        // Validar que se proporcione una fecha válida
        if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ message: 'Fecha no válida' });
        }

        // Convertir la fecha proporcionada al formato correcto para la consulta
        const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day');
        const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day');

        // Buscar eventos por fecha
        const events = await Eventos.find({
            dateTime: {
                $gte: startOfDay.toDate(),
                $lte: endOfDay.toDate()
            }
        });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los eventos', error: error.message });
    }
};