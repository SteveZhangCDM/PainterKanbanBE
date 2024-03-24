const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3002;

connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Test: server connect init" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/paints", require("./routes/paintRoutes.js"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
