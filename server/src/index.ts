import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

console.log('DEBUG: Loaded DATABASE_URL:', process.env.DATABASE_URL ? 'YES (length: ' + process.env.DATABASE_URL.length + ')' : 'NO');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// Middleware for authentication
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware for admin check
const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.user) return res.sendStatus(401);

    const userRoles = await prisma.userRole.findMany({
        where: { userId: req.user.id },
    });

    if (userRoles.some(r => r.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// --- Auth Routes ---

app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roles: {
                    create: { role: 'user' }
                }
            }
        });
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { roles: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: { id: user.id, email: user.email },
            isAdmin: user.roles.some(r => r.role === 'admin')
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { roles: true }
        });
        if (!user) return res.sendStatus(404);
        res.json({
            user: { id: user.id, email: user.email },
            isAdmin: user.roles.some(r => r.role === 'admin')
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Data Routes ---

app.get('/api/houses', async (req, res) => {
    const houses = await prisma.house.findMany({
        orderBy: { name: 'asc' }
    });
    res.json(houses);
});

app.get('/api/events', async (req, res) => {
    const events = await prisma.event.findMany({
        include: { results: { include: { house: true } } },
        orderBy: { date: 'desc' }
    });
    res.json(events);
});

app.post('/api/events', authenticateToken, isAdmin, async (req, res) => {
    const { name, date, results } = req.body;
    try {
        const event = await prisma.event.create({
            data: {
                name,
                date: new Date(date),
                results: {
                    create: results.map((r: any) => ({
                        houseId: r.houseId,
                        position: r.position,
                        points: r.points,
                        headline: r.headline
                    }))
                }
            },
            include: { results: true }
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create event' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
