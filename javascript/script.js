
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

const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    async function loadDashboardBlogs() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/blogs"
            );

            const blogs = await response.json();

            if (blogs.length === 0) {

                dashboardBlogs.innerHTML = `
                    <p>No blogs available yet.</p>
                `;

                return;
            }

            dashboardBlogs.innerHTML = "";

            blogs.forEach(blog => {

                const blogCard = document.createElement("div");

                blogCard.className = "blog-card";

                blogCard.innerHTML = `
                    <h3>${blog.title}</h3>

                    <p>
                        <strong>Category:</strong>
                        ${blog.category || "General"}
                    </p>

                    <p>
                        ${blog.content}
                    </p>

                    <p>
                        <strong>Author:</strong>
                        ${blog.author}
                    </p>
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

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully");

        window.location.href = "login.html";
    });
}