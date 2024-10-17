import express from 'express';
import { addCategory, cafeLogin, cafeRegister, deleteCategory, getCafeDetails } from '../controllers/cafe.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/cafeRegister', cafeRegister);
router.post('/cafeLogin', cafeLogin);
router.get('/getCafeDetails/:cafeId', authenticateJWT, getCafeDetails);
router.post('/postCategory/:cafeId',authenticateJWT, addCategory);
router.delete('/deleteCategory/:cafeId',authenticateJWT, deleteCategory);

export default router;