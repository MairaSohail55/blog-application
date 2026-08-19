const express = require("express");
const cors = require("cors");

const { users, blogs } = require("./data/data");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Blog API is running"
    });
});

app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

app.post("/api/blogs", (req, res) => {
   const { title, content, author, category } = req.body;

    if (!title || !content || !author || !category) {
        return res.status(400).json({
            message: "Title, content and author are required"
        });
    }

    const newBlog = {
        id: blogs.length + 1,
        title,
        category,
        content,
        author,
        createdAt: new Date()
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog
    });
});

app.get("/api/blogs", (req, res) => {
    res.json(blogs);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});