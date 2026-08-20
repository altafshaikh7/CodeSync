import 'dotenv/config';

import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:4000', '*'],
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true
});

// ─── Socket Authentication Middleware ──────────────────────────────────────
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers.authorization?.split(' ')[1];

        const projectId = socket.handshake.query.projectId;

        console.log('🔌 Socket auth attempt:', {
            hasToken: !!token,
            projectId,
            socketId: socket.id
        });

        if (!token) {
            console.error('❌ Socket auth failed: No token');
            return next(new Error('Authentication Error: No token provided'));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            console.error('❌ Socket auth failed: Invalid token', jwtError.message);
            return next(new Error('Authentication Error: Invalid token'));
        }

        if (!decoded || !decoded._id) {
            console.error('❌ Socket auth failed: Invalid decoded token');
            return next(new Error('Authentication Error: Invalid user data'));
        }

        if (!projectId) {
            console.error('❌ Socket auth failed: No projectId');
            return next(new Error('Invalid projectId: No project ID provided'));
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.error('❌ Socket auth failed: Invalid projectId format');
            return next(new Error('Invalid projectId format'));
        }

        const project = await projectModel.findById(projectId);
        if (!project) {
            console.error('❌ Socket auth failed: Project not found:', projectId);
            return next(new Error('Project not found'));
        }

        const isUserInProject = project.users.some(
            u => u.toString() === decoded._id.toString()
        );

        if (!isUserInProject) {
            console.error('❌ Socket auth failed: User not in project');
            return next(new Error('User not authorized for this project'));
        }

        socket.user = decoded;
        socket.project = project;

        console.log('✅ Socket authenticated:', {
            userId: decoded._id,
            projectId: project._id,
            socketId: socket.id
        });

        next();

    } catch (error) {
        console.error('❌ Socket authentication error:', error.message);
        next(new Error(`Authentication Error: ${error.message}`));
    }
});

// ─── Socket Connection Handler ──────────────────────────────────────────────
io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();

    console.log('✅ A user connected:', socket.id, 'to project:', socket.roomId);

    socket.join(socket.roomId);

    // ✅ Send confirmation to client
    socket.emit('connection-established', {
        message: 'Connected to project',
        projectId: socket.roomId,
        userId: socket.user._id
    });

    // ─── Handle project messages ────────────────────────────────────────────
    socket.on('project-message', async (data) => {
        try {
            console.log('📨 Message received:', {
                roomId: socket.roomId,
                sender: data.sender?.email || data.sender?._id || 'unknown',
                messageLength: data.message?.length || 0
            });

            // ✅ Validate message
            if (!data.message || !data.message.trim()) {
                console.error('❌ Empty message received');
                socket.emit('error', { message: 'Message cannot be empty' });
                return;
            }

            if (!data.sender) {
                console.error('❌ No sender in message');
                socket.emit('error', { message: 'Sender information missing' });
                return;
            }

            // ✅ Prepare message data
            const messageData = {
                sender: {
                    _id: data.sender._id || data.sender.email || 'unknown',
                    email: data.sender.email || 'unknown'
                },
                message: data.message.trim(),
                timestamp: data.timestamp || new Date()
            };

            // ✅ Save to database
            const updatedProject = await projectModel.findByIdAndUpdate(
                socket.roomId,
                {
                    $push: {
                        messages: messageData
                    }
                },
                { new: true }
            );

            if (!updatedProject) {
                console.error('❌ Project not found for message:', socket.roomId);
                socket.emit('error', { message: 'Project not found' });
                return;
            }

            console.log('✅ Message saved to database');

            // ✅ Add _id to message for frontend
            const savedMessage = updatedProject.messages[updatedProject.messages.length - 1];
            const messageWithId = {
                ...messageData,
                _id: savedMessage._id
            };

            // ✅ Broadcast to ALL clients in the room (including sender)
            io.to(socket.roomId).emit('project-message', messageWithId);

            console.log('✅ Message broadcasted to room:', socket.roomId);

        } catch (error) {
            console.error('❌ Project message error:', error.message);
            console.error('Stack:', error.stack);
            socket.emit('error', { message: 'Failed to send message: ' + error.message });
        }
    });

    // ─── Handle collaborator added ──────────────────────────────────────────
    socket.on('collaborator-added', (data) => {
        console.log('👤 Collaborator added:', data);
        io.to(socket.roomId).emit('collaborator-added', data);
    });

    // ─── Handle project deleted ─────────────────────────────────────────────
    socket.on('project-deleted', (data) => {
        console.log('🗑️ Project deleted:', data);
        socket.broadcast
            .to(socket.roomId)
            .emit('project-deleted', data);
    });

    // ─── Handle disconnect ──────────────────────────────────────────────────
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        socket.leave(socket.roomId);
    });

    // ─── Handle errors ──────────────────────────────────────────────────────
    socket.on('error', (error) => {
        console.error('❌ Socket error from client:', error);
    });
});

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});