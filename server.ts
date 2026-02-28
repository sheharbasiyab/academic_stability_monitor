import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // In-memory state
  let activities = [
    { id: 1, studentId: 'S101', name: 'NSS Volunteer', points: 20, status: 'Approved', groupId: 1, date: '2025-12-15', imageUrl: 'https://picsum.photos/seed/nss/800/600' },
    { id: 2, studentId: 'S101', name: 'Hackathon Winner', points: 15, status: 'Pending', groupId: 0, date: '2026-01-20', imageUrl: 'https://picsum.photos/seed/hackathon/800/600' },
  ];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_student", (studentId) => {
      socket.join(`student_${studentId}`);
      console.log(`Socket ${socket.id} joined student_${studentId}`);
      // Send initial activities for this student
      socket.emit("activities_list", activities.filter(a => a.studentId === studentId));
    });

    socket.on("join_teacher", () => {
      socket.join("teachers");
      console.log(`Socket ${socket.id} joined teachers room`);
      // Send all activities to teacher
      socket.emit("all_activities", activities);
    });

    socket.on("add_activity", (newActivity) => {
      const activity = {
        ...newActivity,
        id: Date.now(),
        status: 'Pending'
      };
      activities.push(activity);
      
      // Notify the student
      io.to(`student_${activity.studentId}`).emit("activity_added", activity);
      // Notify all teachers
      io.to("teachers").emit("new_activity_alert", activity);
    });

    socket.on("update_activity_status", ({ id, status }) => {
      const index = activities.findIndex(a => a.id === id);
      if (index !== -1) {
        activities[index].status = status;
        const updatedActivity = activities[index];
        
        // Notify the specific student
        io.to(`student_${updatedActivity.studentId}`).emit("activity_updated", updatedActivity);
        // Notify all teachers
        io.to("teachers").emit("activity_updated", updatedActivity);
      }
    });

    socket.on("remove_activity", (id) => {
      const activity = activities.find(a => a.id === id);
      if (activity) {
        activities = activities.filter(a => a.id !== id);
        io.to(`student_${activity.studentId}`).emit("activity_removed", id);
        io.to("teachers").emit("activity_removed", id);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
