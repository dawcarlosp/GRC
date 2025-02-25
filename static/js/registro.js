async function registro() {
    const username = document.getElementById("nombreUsuario").value;
    const password = document.getElementById("contrasenia").value;
    const email = document.getElementById("email").value;
    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, email })
        });

        if (!response.ok) {
            alert("No se ha podido registrar");
            throw new Error("Error en la autenticación");
        }else{
            alert("Te has registrado correctamente");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("registrarse").addEventListener("click", registro);