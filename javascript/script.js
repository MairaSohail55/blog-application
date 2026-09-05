// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                registerForm.reset();

                window.location.href = "login.html";

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");
        }
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data.user)
                );

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");
        }
    });
}


// ===============================
// CREATE BLOG
// ===============================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value;

        // Get logged-in user
        const savedUser = localStorage.getItem("loggedInUser");

        let author = "Anonymous";

        if (savedUser) {

            const user = JSON.parse(savedUser);

            author = user.name;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/blogs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        content: content,
                        author: author,
                        category: category
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                blogForm.reset();

                console.log("Created blog:", data.blog);

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.error("Error:", error);

            alert("Unable to connect to the server.");
        }
    });
}


// ===============================
// DASHBOARD
// ===============================

const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    async function loadDashboardBlogs() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/blogs"
            );

            const blogs = await response.json();

            dashboardBlogs.innerHTML = "";

            if (blogs.length === 0) {

                dashboardBlogs.innerHTML = `
                    <p>No blogs available yet.</p>
                `;

                return;
            }

            blogs.forEach(blog => {

                const blogCard = document.createElement("div");

                blogCard.className = "blog-card";

                blogCard.innerHTML = `
                    
                    <h3>${blog.title}</h3>

                    <p>
                        <strong>Category:</strong>
                        ${blog.category}
                    </p>

                    <p>
                        ${blog.content}
                    </p>

                    <p>
                        <strong>Author:</strong>
                        ${blog.author}
                    </p>

                    <div class="blog-actions">

                        <button
                            class="edit-btn"
                            onclick="editBlog('${blog._id}')">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteBlog('${blog._id}')">
                            Delete
                        </button>

                    </div>
                `;

                dashboardBlogs.appendChild(blogCard);

            });

        } catch (error) {

            console.error(
                "Error loading blogs:",
                error
            );

            dashboardBlogs.innerHTML = `
                <p>
                    Unable to load blogs.
                    Make sure the backend server is running.
                </p>
            `;
        }
    }

    // Load dashboard blogs only once
    loadDashboardBlogs();
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully");

        window.location.href = "login.html";

    });
}


// ===============================
// DELETE BLOG
// ===============================

async function deleteBlog(blogId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/blogs/${blogId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete blog"
            );

            return;
        }

        alert("Blog deleted successfully!");

        // Reload dashboard
        const dashboardBlogs =
            document.getElementById("dashboardBlogs");

        if (dashboardBlogs) {

            location.reload();
        }

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Could not connect to the server."
        );
    }
}


// ===============================
// EDIT BLOG
// ===============================

async function editBlog(blogId) {

    try {

        // Get existing blog
        const response = await fetch(
            `http://localhost:5000/api/blogs/${blogId}`
        );

        const blog = await response.json();

        if (!response.ok) {

            alert(
                blog.message ||
                "Blog not found"
            );

            return;
        }


        // Edit title
        const title = prompt(
            "Enter new blog title:",
            blog.title
        );

        if (title === null) {

            return;
        }


        // Edit category
        const category = prompt(
            "Enter new category:",
            blog.category
        );

        if (category === null) {

            return;
        }


        // Edit content
        const content = prompt(
            "Enter new blog content:",
            blog.content
        );

        if (content === null) {

            return;
        }


        // Send updated blog
        const updateResponse = await fetch(
            `http://localhost:5000/api/blogs/${blogId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title: title,

                    category: category,

                    content: content,

                    author: blog.author
                })
            }
        );

        const data = await updateResponse.json();

        if (!updateResponse.ok) {

            alert(
                data.message ||
                "Failed to update blog"
            );

            return;
        }

        alert("Blog updated successfully!");

        // Refresh dashboard
        location.reload();

    } catch (error) {

        console.error(
            "Edit error:",
            error
        );

        alert(
            "Could not connect to the server."
        );
    }
}