const token = localStorage.getItem("token");
let cuadro = document.getElementById("cuadro");
let fechaEscogida;
let horaSeleccionada;
let reservas = [];
let mesas = [];
let ip = "192.168.21.159";
let idMesa;
let numeroPersonas;
// Verificar autenticación
if (!token) {
    location.href = "html/login.html";
    throw new Error("No hay token, inicia sesión.");
}
 // Decodificar el token (en base64)
 const base64Url = token.split('.')[1];
 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
 const decodedToken = JSON.parse(window.atob(base64));

 console.log(decodedToken);  // Aquí puedes ver los datos del usuario (como el ID)
 const idCliente = decodedToken.sub;  // Si el ID está en el payload del token
 console.log("idcliente"+idCliente);
// Obtener reservas
async function obtenerReservas() {
    try {
        //Para probarlo desde el movil
        const response = await fetch(`http://${ip}:8080/reservas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
        }
        if (!response.ok) throw new Error("Error al obtener las reservas");
        reservas = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Obtener mesas
async function obtenerMesas() {
    try {
        const response = await fetch(`http://${ip}:8080/mesas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
        }
        if (!response.ok) throw new Error("Error al obtener las mesas");

        mesas = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Generar el select con horas disponibles
function generarHorasDisponibles(valor, inicio, cierre) {
    let select = document.getElementById("select");
    if (!select) {
        select = document.createElement("select");
        select.id = "select";
        select.className = "border";
        cuadro.appendChild(select);
    } else {
        select.innerHTML = ""; // Limpiar opciones sin eliminar el select
    }

    let label = document.getElementById("label");
    if (!label) {
        label = document.createElement("label");
        label.id = "label";
        label.textContent = "Hora reserva: ";
        cuadro.insertBefore(label, select);
    }

    for (let i = inicio; i <= cierre; i++) {
        let option = document.createElement("option");
        option.textContent = `${i}:00`;
        option.value = `${i}:00`;
        select.appendChild(option);
    }

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
    horaSeleccionada = document.getElementById("select").value;
    if (!horaSeleccionada) return;

    let reservasDiaHora = reservas.filter(reserva => 
        reserva.fechaReserva === fechaEscogida && reserva.horaReserva.startsWith(horaSeleccionada)
    );

    let mesasOcupadas = reservasDiaHora.map(reserva => reserva.mesa.id);
    
    let mesasUI = document.querySelectorAll(".mesa");
    if (mesasUI.length === 0) {
        // Si las mesas aún no han sido creadas, créalas una sola vez
        mesas.forEach(mesa => {
            let div = document.createElement("div");
            div.textContent = "Mesa " + mesa.numeroMesa;
            div.className = "mesa rounded-3xl bg-black text-amber-600 w-20 h-20 flex justify-center items-center hover:scale-110 my-1 cursor-pointer";
            
            div.dataset.id = mesa.id; // Para identificar cada mesa
            div.addEventListener("click", () => {
                alert(`Has seleccionado la mesa ${mesa.numeroMesa}`);
                idMesa = mesa.numeroMesa;
                pintarInputNumerico();
            });

            cuadro.appendChild(div);
        });
    } 

    // Solo cambiar visibilidad de las mesas en lugar de recrearlas
    document.querySelectorAll(".mesa").forEach(mesa => {
        let idMesa = parseInt(mesa.dataset.id);
        if (mesasOcupadas.includes(idMesa)) {
            mesa.style.display = "none"; // Ocultar si está ocupada
        } else {
            mesa.style.display = "flex"; // Mostrar si está disponible
        }
    });
}
//boton de reserva;
function inyeccionboton(){
    //Asignar el valor
    numeroPersonas = document.getElementById("inputNumero").value;
    let boton = document.getElementById("boton");
    if(boton) boton.remove();
    boton = document.createElement("button");
    boton.id = "boton";
    boton.className ="border rounded-xl mt-2 hover:bg-black hover:text-amber-600 p-1 cursor-pointer hover:scale-110";
    boton.textContent = "Reservar";
    boton.addEventListener("click", reservar);
    cuadro.appendChild(boton);
}
//pintar numero de personas
function pintarInputNumerico(){
    let input = document.getElementById("inputNumero");
    if (!input) {
        input = document.createElement("input");
        input.id = "inputNumero";
        input.type = "number";
        input.className = "border";
        input.min = 1;
        input.max = 20;
        input.step = 1;
        input.value = 1;

        let label = document.createElement("label");
        label.id = "labelNumero";
        label.textContent = "Vamos a ser(comensales): ";
        cuadro.appendChild(label);
        cuadro.appendChild(input);

        input.addEventListener("change", inyeccionboton);
    }
}
// Cargar datos iniciales
(async function iniciarApp() {
    await obtenerReservas();
    await obtenerMesas();
})();
//Reservar 
async function reservar(){
    fechaReserva = fechaEscogida;
    horaReserva = horaSeleccionada;
    const reserva= {idMesa, idCliente, fechaReserva, horaReserva, numeroPersonas};

    console.log(reserva);

    try{
        const response = await fetch("http://localhost:8080/reservas",
            {
                method: 'POST',
                headers:{
                    "Authorization": `Bearer ${token}`,
                    'content-Type':'application/json'
                },
                body: JSON.stringify(reserva)
            })
        if(!response.ok)
        {
            throw new Error("Error al insertar el proyecto")
        }
        //Capturo la respuesta para coger el id
        const reservaInsertada = await response.json();
        console.log(reservaInsertada);
        window.location.href = "success.html";
}catch (error){
    console.error(error);
}
}