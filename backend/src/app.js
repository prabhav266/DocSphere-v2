const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const requestRoutes = require("./routes/requestRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/requests", requestRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Must be registered after all routes
app.use(notFound);
app.use(errorHandler);

module.exports = app;
