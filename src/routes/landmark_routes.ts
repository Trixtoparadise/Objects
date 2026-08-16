import { Router } from 'express';
import { getLandmarks, getLandmarkById } from '../controller/landmark_controller.ts';

const landmark_router = Router();

landmark_router.get('/landmarks', getLandmarks);
landmark_router.get('/landmarks/:id', getLandmarkById);

export default landmark_router;