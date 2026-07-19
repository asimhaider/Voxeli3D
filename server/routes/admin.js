import { Router } from 'express';
import { login, logout, requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/session', requireAdmin, (req, res) => res.json({ authenticated: true }));

export default router;
