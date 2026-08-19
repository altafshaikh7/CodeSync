import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        if (!token) {
            return next(new Error('Authentication Error'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Authentication Error'));
        }
        socket.user = decoded;
        socket.project = await projectModel.findById(projectId);
        if (!socket.project) {
            return next(new Error('Project not found'));
        }
        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    console.log('A user is connected:', socket.id);

    socket.join(socket.roomId);

    // Collaboration only – no AI generation
    socket.on('project-message', async data => {
        await projectModel.findByIdAndUpdate(socket.roomId, {
            $push: {
                messages: {
                    sender: data.sender,
                    message: data.message
                }
            }
        });
        socket.broadcast.to(socket.roomId).emit('project-message', data);
    });

    socket.on('collaborator-added', (data) => {
        io.to(socket.roomId).emit('collaborator-added', data);
    });

    socket.on('project-deleted', (data) => {
        socket.broadcast.to(socket.roomId).emit('project-deleted', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});