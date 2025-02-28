const token = localStorage.getItem("token");
let cuadro = document.getElementById("cuadro");
let fechaEscogida;
let reservas = [];
let mesas = [];

// Verificar autenticación
if (!token) {
    location.href = "html/login.html";
    throw new Error("No hay token, inicia sesión.");
}

// Obtener reservas
async function obtenerReservas() {
    try {
        const response = await fetch("http://localhost:8080/reservas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al obtener las reservas");

        reservas = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Obtener mesas
async function obtenerMesas() {
    try {
        const response = await fetch("http://localhost:8080/mesas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al obtener las mesas");

        mesas = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Generar el select con horas disponibles
function generarHorasDisponibles(valor, inicio, cierre) {
    let select = document.getElementById("select");
    if (select) select.remove();

    let label = document.getElementById("label");
    if (label) label.remove();

    select = document.createElement("select");
    select.id = "select";
    label = document.createElement("label");
    label.id = "label";
    label.textContent = "Hora reserva: ";

    for (let i = inicio; i <= cierre; i++) {
        let horaStr = `${i}:00`;
        let option = document.createElement("option");
        option.textContent = horaStr;
        option.value = horaStr;
        select.appendChild(option);
    }

    select.className = "border";
    cuadro.appendChild(label);
    cuadro.appendChild(select);

    select.addEventListener("change", pintarMesas);
}

// Evento cuando cambia la fecha
document.getElementById("fechaReserva").addEventListener("change", (event) => {
    fechaEscogida = event.target.value;
    //cambio de año-mes-dia A dia-mes-año
    fechaEscogida = fechaEscogida.split("-").reverse().join("-");
    generarHorasDisponibles(fechaEscogida, 12, 20);
});

// Pintar solo mesas disponibles
function pintarMesas() {
    let horaSeleccionada = document.getElementById("select").value;
    if (!horaSeleccionada) return;
    alert(fechaEscogida)
    // Filtrar reservas que coincidan con la fecha y hora seleccionadas
    let reservasDiaHora = reservas.filter(reserva => 
        reserva.fechaReserva === fechaEscogida && reserva.horaReserva === "17:49"
    );
    console.log("reservas")
    console.log(reservas)
    // Obtener IDs de mesas ocupadas
   console.log("reserva dia hora");
   console.log(reservasDiaHora)
    let mesasOcupadas = reservasDiaHora.map(reserva => reserva.mesa.id);
    // Limpiar solo los elementos de las mesas (sin borrar la UI completa)
    document.querySelectorAll(".mesa").forEach(mesa => mesa.remove());
    mesasOcupadas.forEach(mesa => alert(mesa.id));
    let mesasDisponibles = mesas.filter(mesa => !mesasOcupadas.includes(mesa.id));
    //mesasDisponibles.forEach(mesa => alert(mesa.id))
    if (mesasDisponibles.length === 0) {
        let mensaje = document.createElement("p");
        mensaje.textContent = "No hay mesas disponibles para esta fecha y hora.";
        mensaje.className = "text-red-500";
        cuadro.appendChild(mensaje);
        return;
    }

    // Pintar solo mesas disponibles
    mesasDisponibles.forEach(mesa => {
        let div = document.createElement("div");
        div.textContent = "Mesa " + mesa.numeroMesa;
        div.className = "mesa rounded-3xl bg-black text-amber-600 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
        
        div.addEventListener("click", () => {
            alert(`Has seleccionado la mesa ${mesa.numeroMesa}`);
        });

        cuadro.appendChild(div);
    });
}

// Cargar datos iniciales
(async function iniciarApp() {
    await obtenerReservas();
    await obtenerMesas();
})();
