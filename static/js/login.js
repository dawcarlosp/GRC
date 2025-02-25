async function login() {
    const username = document.getElementById("nombreUsuario").value;
    const password = document.getElementById("contrasenia").value;
    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            alert("Usuario e passwords incorrectos");
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        alert(data.token),
        localStorage.setItem("token", data.token); // Guardar token
        location.href = "../index.html";
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("iniciarSesion").addEventListener("click", login);