// ===============================
// AUTH HELPERS
// ===============================

const API_URL = "http://localhost:5000";

function getToken() {
    return localStorage.getItem("token");
}

function getLoggedInUser() {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        console.error("Invalid user data:", error);
        return null;
    }
}

function requireLogin() {
    const token = getToken();

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }

    return true;
}


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
                `${API_URL}/api/register`,
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

                alert(data.message || "Registration failed");

            }

        } catch (error) {

            console.error("Registration error:", error);

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
                `${API_URL}/api/login`,
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

                // Save JWT token
                localStorage.setItem("token", data.token);

                // Save logged-in user
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Login successful!");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message || "Login failed");

            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to the server.");

        }
    });
}


// ===============================
// CREATE BLOG
// ===============================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    // Protect create blog page
    if (!requireLogin()) {
        // Stop here if user is not logged in
    } else {

        blogForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const title =
                document.getElementById("blogTitle").value;

            const category =
                document.getElementById("blogCategory").value;

            const content =
                document.getElementById("blogContent").value;

            const token = getToken();

            try {

                const response = await fetch(
                    `${API_URL}/api/blogs`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            title,
                            content,
                            category
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    blogForm.reset();

                    console.log(
                        "Created blog:",
                        data.blog
                    );

                } else {

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {
                        alert(
                            "Your login session has expired. Please login again."
                        );

                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href = "login.html";

                        return;
                    }

                    alert(
                        data.message ||
                        "Failed to create blog"
                    );

                }

            } catch (error) {

                console.error(
                    "Create blog error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            }
        });
    }
}


// ===============================
// DASHBOARD
// ===============================

const dashboardBlogs =
    document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    // Protect dashboard
    if (!requireLogin()) {

        // User will be redirected to login

    } else {

        async function loadDashboardBlogs() {

            const token = getToken();

            const currentUser = getLoggedInUser();

            try {

                const response = await fetch(
                    `${API_URL}/api/blogs`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const blogs = await response.json();

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    alert(
                        "Your login session has expired. Please login again."
                    );

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    window.location.href = "login.html";

                    return;
                }

                if (!response.ok) {

                    throw new Error(
                        blogs.message ||
                        "Failed to load blogs"
                    );

                }

                dashboardBlogs.innerHTML = "";

                /*
                 * IMPORTANT:
                 * We only display blogs belonging to
                 * the currently logged-in user.
                 *
                 * This works with the current backend
                 * because blogs currently contain an
                 * author field.
                 */

                let userBlogs = blogs;

                if (currentUser && currentUser.name) {

                    userBlogs = blogs.filter(
                        (blog) =>
                            blog.author === currentUser.name
                    );

                }

                if (userBlogs.length === 0) {

                    dashboardBlogs.innerHTML = `
                        <p>No blogs created by you yet.</p>
                    `;

                    return;
                }

                userBlogs.forEach(blog => {

                    const blogCard =
                        document.createElement("div");

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

        loadDashboardBlogs();
    }
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        // Remove JWT
        localStorage.removeItem("token");

        // Remove user information
        localStorage.removeItem("user");

        alert("Logged out successfully");

        window.location.href = "login.html";

    });
}


// ===============================
// DELETE BLOG
// ===============================

async function deleteBlog(blogId) {

    // Check login
    if (!requireLogin()) {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = getToken();

    try {

        const response = await fetch(
            `${API_URL}/api/blogs/${blogId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Your login session has expired. Please login again."
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

            return;
        }

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete blog"
            );

            return;
        }

        alert(
            "Blog deleted successfully!"
        );

        // Refresh dashboard
        location.reload();

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
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {
        // Get the blog
        const response = await fetch(
            `${API_URL}/api/blogs/${blogId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Access denied.");
            return;
        }

        // Ask for new values
        const title = prompt("Enter new title:", data.title);
        if (title === null) return;

        const category = prompt("Enter new category:", data.category);
        if (category === null) return;

        const content = prompt("Enter new content:", data.content);
        if (content === null) return;

        // Update the blog
        const updateResponse = await fetch(
            `${API_URL}/api/blogs/${blogId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content
                })
            }
        );

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
            alert(updateData.message || "Could not update blog.");
            return;
        }

        alert("Blog updated successfully!");

        // Reload dashboard
        window.location.reload();

    } catch (error) {
        console.error("Edit error:", error);
        alert("Something went wrong while editing the blog.");
    }
}