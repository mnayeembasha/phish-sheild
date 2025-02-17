const express = require("express");
const cors = require("cors");
const { urlChecker } = require("./controllers/urlChecker");
const { emailSpamChecker } = require("./controllers/emailSpamChecker");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/check-url", urlChecker);
app.post('/api/check-spam', emailSpamChecker);


const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
