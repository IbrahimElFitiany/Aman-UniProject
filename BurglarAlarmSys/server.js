const express = require('express');
const db = require('./config/config');
const allModels = require('./models/index')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const PORT = 3000;
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes)
app.use("/user", userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
