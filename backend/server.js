require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// ===============================
// Home / Test Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Blog API is running"
    });
});

// ===============================
// REGISTER
// POST /api/register
// ===============================

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// ===============================
// LOGIN
// POST /api/login
// ===============================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

// ===============================
// CREATE BLOG
// POST /api/blogs
// ===============================

app.post("/api/blogs", async (req, res) => {
    try {
        const { title, content, author, category } = req.body;

        if (!title || !content || !author || !category) {
            return res.status(400).json({
                message: "Title, content, author and category are required"
            });
        }

        const newBlog = new Blog({
            title,
            content,
            author,
            category
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        });

    } catch (error) {
        console.error("Create blog error:", error);

        res.status(500).json({
            message: "Failed to create blog",
            error: error.message
        });
    }
});

// ===============================
// GET ALL BLOGS
// GET /api/blogs
// ===============================

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({
            createdAt: -1
        });

        res.json(blogs);

    } catch (error) {
        console.error("Get blogs error:", error);

        res.status(500).json({
            message: "Failed to get blogs",
            error: error.message
        });
    }
});

// ===============================
// GET SINGLE BLOG
// GET /api/blogs/:id
// ===============================

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(blog);

    } catch (error) {
        console.error("Get blog error:", error);

        res.status(500).json({
            message: "Failed to get blog",
            error: error.message
        });
    }
});

// ===============================
// UPDATE BLOG
// PUT /api/blogs/:id
// ===============================

app.put("/api/blogs/:id", async (req, res) => {
    try {
        const { title, content, author, category } = req.body;

        if (!title || !content || !author || !category) {
            return res.status(400).json({
                message: "Title, content, author and category are required"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                author,
                category
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        console.error("Update blog error:", error);

        res.status(500).json({
            message: "Failed to update blog",
            error: error.message
        });
    }
});

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(blog);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch blog"
        });
    }
});

// ===============================
// DELETE BLOG
// DELETE /api/blogs/:id
// ===============================

app.delete("/api/blogs/:id", async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(
            req.params.id
        );

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Delete blog error:", error);

        res.status(500).json({
            message: "Failed to delete blog",
            error: error.message
        });
    }
});

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch blogs"
        });
    }
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});