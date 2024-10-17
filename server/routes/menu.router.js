import express from 'express';
import {getMenu, addDish, deleteDish, updateDishStatus, getDishStatus} from '../controllers/menu.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/addDish/:cafeId', authenticateJWT, addDish);
router.get('/getMenu/:cafeId', authenticateJWT, getMenu);
router.delete('/deleteDish/:cafeId', authenticateJWT, deleteDish);
router.get('/getDishStatus/:cafeId/:dishName/:dishCategory', authenticateJWT, getDishStatus);
router.post('/updateDishStatus/:cafeId', authenticateJWT, updateDishStatus);

export default router;