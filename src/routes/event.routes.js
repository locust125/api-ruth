import express from 'express';
import * as controllerE from '../controllers/events.controller.js';
import { validateCreateEvent,validateUpdateStatus } from "../validators/eventsValidators.js";
import * as verify from "../middleware/authJwt.js";

const router = express.Router();

router.post('/createEvent', controllerE.createEvent);
router.get('/getAll/events', controllerE.getEvents);
router.get('/:id/events', controllerE.getEventById);
router.put('/:id/status/events',validateUpdateStatus,controllerE.updateEventStatus);
router.get('/status', controllerE.getEventsByStatus);
router.put('/:id/confirm-assist',controllerE.confirmAttendance );
router.put('/:id/decrease-assist',verify.verifyToken,controllerE.decreaseAttendance);

router.get('/events/:date', controllerE.getEventsByDate);
export default router;