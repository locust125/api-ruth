import { check } from 'express-validator';
import { validateResult } from "../libs/validateHelpers.js";

export const validateCreateEvent = [
    // Validación para el campo name
    check("name")
        .exists().withMessage("El nombre es requerido")
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ min: 1, max: 100 }).withMessage("El nombre debe tener entre 1 y 100 caracteres"),
    
    // Validación para el campo dateTime
    check("dateTime")
        .exists().withMessage("La fecha y hora son requeridas")
        .isISO8601().withMessage("La fecha y hora deben ser una fecha válida")
        .notEmpty().withMessage("La fecha y hora no pueden estar vacías"),

    // Validación para el campo description
    check("description")
        .optional()
        .isString().withMessage("La descripción debe ser una cadena de texto")
        .isLength({ max: 500 }).withMessage("La descripción no debe exceder los 500 caracteres"),

    // Validación para el campo guests
    check("guests")
        .optional()
        .isArray().withMessage("Los invitados deben ser un arreglo de cadenas de texto")
        .custom((guests) => guests.every(guest => typeof guest === 'string')).withMessage("Cada invitado debe ser una cadena de texto"),

    // Validación para el campo price
    check("price")
        .exists().withMessage("El precio es requerido"),

    // Validación para el campo location.type
    check("location.type")
        .exists().withMessage("El tipo de ubicación es requerido")
        .equals("Point").withMessage("El tipo de ubicación debe ser 'Point'"),

    // Validación para el campo location.coordinates
    check("location.coordinates")
        .exists().withMessage("Las coordenadas de ubicación son requeridas")
        .isArray({ min: 2, max: 2 }).withMessage("Las coordenadas de ubicación deben ser un arreglo de dos números")
        .custom(coordinates => coordinates.every(coordinate => typeof coordinate === 'number')).withMessage("Cada coordenada debe ser un número"),

    // Validación para el campo status
    check("status")
        .optional()
        .isIn(["active", "inactive", "canceled", "completed"]).withMessage("El estado debe ser uno de 'active', 'inactive', 'canceled', 'completed'"),

    // Validación de resultados
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

export const validateUpdateStatus = [

    // Validación para el campo status
    check("status")
        .optional()
        .isIn(["active", "inactive", "canceled", "completed"]).withMessage("El estado debe ser uno de 'active', 'inactive', 'canceled', 'completed'"),

    // Validación de resultados
    (req, res, next) => {
        validateResult(req, res, next);
    },
];
