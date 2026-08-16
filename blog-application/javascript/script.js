const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("blogUser", JSON.stringify(user));

        alert("Registration successful!");

        window.location.href = "login.html";
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const savedUser =
            JSON.parse(localStorage.getItem("blogUser"));

        if (!savedUser) {
            alert("No account found. Please register first.");
            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid email or password.");

        }

    });
}


const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const title =
            document.getElementById("blogTitle").value.trim();

        const category =
            document.getElementById("blogCategory").value;

        const content =
            document.getElementById("blogContent").value.trim();

        const user =
            JSON.parse(localStorage.getItem("blogUser"));

        const blogs =
            JSON.parse(localStorage.getItem("blogs")) || [];

        const newBlog = {

            id: Date.now(),

            title: title,

            category: category,

            content: content,

            author: user ? user.name : "Anonymous",

            date: new Date().toLocaleDateString()

        };

        blogs.push(newBlog);

        localStorage.setItem(
            "blogs",
            JSON.stringify(blogs)
        );

        alert("Blog published successfully!");

        window.location.href = "dashboard.html";

    });
}


const dashboardBlogs =
    document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    const blogs =
        JSON.parse(localStorage.getItem("blogs")) || [];

    if (blogs.length === 0) {

        dashboardBlogs.innerHTML =
            "<p>You haven't created any blogs yet.</p>";

    } else {

        blogs.forEach(function (blog) {

            const article =
                document.createElement("article");

            article.className = "blog-card";

            article.innerHTML = `

                <span class="category">
                    ${blog.category}
                </span>

                <h3>
                    ${blog.title}
                </h3>

                <p>
                    ${blog.content}
                </p>

                <small>
                    By ${blog.author} • ${blog.date}
                </small>

            `;

            dashboardBlogs.appendChild(article);

        });

    }
}


const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("isLoggedIn");

        alert("Logged out successfully.");

        window.location.href = "index.html";

    });
}