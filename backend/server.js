require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });


// ===============================
// JWT AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message:
                "Access denied. Please login first."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message:
                "Invalid or expired token."
        });
    }
}


// ===============================
// HOME / TEST ROUTE
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

app.post(
    "/api/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            if (!name || !email || !password) {

                return res.status(400).json({
                    message:
                        "All fields are required"
                });
            }


            const normalizedEmail =
                email.toLowerCase().trim();


            // Check existing user
            const existingUser =
                await User.findOne({
                    email: normalizedEmail
                });


            if (existingUser) {

                return res.status(400).json({
                    message:
                        "User already exists"
                });
            }


            // Hash password
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // Create user
            const newUser = new User({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword
            });


            await newUser.save();


            res.status(201).json({

                message:
                    "Registration successful",

                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }

            });

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            res.status(500).json({

                message:
                    "Registration failed",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// LOGIN
// POST /api/login
// ===============================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    message:
                        "Email and password are required"
                });
            }


            const normalizedEmail =
                email.toLowerCase().trim();


            // Find user
            const user =
                await User.findOne({
                    email: normalizedEmail
                });


            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }


            // Compare password
            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }


            // ===============================
            // CREATE JWT TOKEN
            // ===============================

            const token = jwt.sign(

                {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }
            );


            res.json({

                message:
                    "Login successful",

                token: token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }

            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            res.status(500).json({

                message:
                    "Login failed",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// GET USER'S BLOGS
// GET /api/blogs
// PROTECTED ROUTE
// ===============================

app.get(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            /*
             * Only return blogs belonging
             * to the currently logged-in user.
             */

            const blogs =
                await Blog.find({
                    user: req.user.id
                }).sort({
                    createdAt: -1
                });


            res.json(blogs);

        } catch (error) {

            console.error(
                "Get user blogs error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to get blogs",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// GET SINGLE BLOG
// GET /api/blogs/:id
// PROTECTED ROUTE
// ===============================

app.get(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            /*
             * Find the blog AND make sure
             * it belongs to the logged-in user.
             */

            const blog =
                await Blog.findOne({

                    _id: req.params.id,

                    user: req.user.id

                });


            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found or you are not the owner"

                });
            }


            res.json(blog);

        } catch (error) {

            console.error(
                "Get blog error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to get blog",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// CREATE BLOG
// POST /api/blogs
// PROTECTED ROUTE
// ===============================

app.post(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                content,
                category
            } = req.body;


            if (
                !title ||
                !content ||
                !category
            ) {

                return res.status(400).json({

                    message:
                        "Title, content and category are required"

                });
            }


            /*
             * IMPORTANT:
             *
             * The browser does NOT decide
             * who owns the blog.
             *
             * The owner comes from the
             * authenticated JWT token.
             */

            const newBlog = new Blog({

                title:
                    title.trim(),

                content,

                category,

                author:
                    req.user.name,

                user:
                    req.user.id

            });


            await newBlog.save();


            res.status(201).json({

                message:
                    "Blog created successfully",

                blog:
                    newBlog

            });

        } catch (error) {

            console.error(
                "Create blog error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to create blog",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// UPDATE BLOG
// PUT /api/blogs/:id
// PROTECTED ROUTE
// ===============================

app.put(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                content,
                category
            } = req.body;


            if (
                !title ||
                !content ||
                !category
            ) {

                return res.status(400).json({

                    message:
                        "Title, content and category are required"

                });
            }


            /*
             * IMPORTANT:
             *
             * The query checks both:
             *
             * 1. Blog ID
             * 2. Current user's ID
             *
             * Therefore another user cannot
             * update this blog.
             */

            const blog =
                await Blog.findOne({

                    _id:
                        req.params.id,

                    user:
                        req.user.id

                });


            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found or you are not the owner"

                });
            }


            blog.title =
                title.trim();

            blog.content =
                content;

            blog.category =
                category;


            await blog.save();


            res.json({

                message:
                    "Blog updated successfully",

                blog

            });

        } catch (error) {

            console.error(
                "Update blog error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to update blog",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// DELETE BLOG
// DELETE /api/blogs/:id
// PROTECTED ROUTE
// ===============================

app.delete(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            /*
             * Find the blog using both
             * its ID and the logged-in
             * user's ID.
             */

            const blog =
                await Blog.findOne({

                    _id:
                        req.params.id,

                    user:
                        req.user.id

                });


            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found or you are not the owner"

                });
            }


            await Blog.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Blog deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete blog error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to delete blog",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// START SERVER
// ===============================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);