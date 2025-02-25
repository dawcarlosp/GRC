const token = localStorage.getItem("token");
let cuadro = document.getElementById("cuadro");
let reservas = [];
obtenerReservas();
async function obtenerReservas() {
    try {
        if (!token) {
            location.href = "html/login.html";
            throw new Error("No hay token, inicia sesión.");
        }
        const response = await fetch("http://localhost:8080/reservas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if(!response.ok)
        {
            throw new Error("Error al obtener las reservas")
        }
        const reservasObtenidas = await response.json();
        reservas = reservasObtenidas;
    } catch (error) {
        console.error("Error:", error);
    }
}
function generarHorasDisponibles(inicio, cierre) {
    let selectAnterior = document.getElementById("select");
    let labelAnterior = document.getElementById("label");
    //Si ya tengo un select y un label creado, lo borro para no tener elementos duplicados  
    if(selectAnterior && labelAnterior){
    cuadro.removeChild(labelAnterior);
    cuadro.removeChild(selectAnterior);
    }
    const select = document.createElement("select");
    select.id="select";
    const label = document.createElement("label");
    label.id = "label";
    alert(reservas[0].horaReserva);
    label.textContent = "Hora reserva:"
    for (let i = inicio; i <= cierre; i++) {
       let hora = `${i}:00`;
       let option = document.createElement("option");
       option.textContent = hora;
       option.value = hora;
       select.appendChild(option);
    }
    select.className="border";
    cuadro.appendChild(label);
    cuadro.appendChild(select);
    //Intento pintar las mesas disponibles en la fecha y hora elegidas
    select.addEventListener("change", () =>{
        alert(select.value);
        pintarMesas();
    })}
//Intento de evento cuando se selecciona una fecha
let fechaInput = document.getElementById("fechaReserva");
fechaInput.addEventListener("change", () => generarHorasDisponibles(12,20));
//Metodo para pintar las mesas disponibles
function pintarMesas(){
    let mesas = [1,2,3,4];
    cuadro.innerHTML = "";
    regenerarFecha();
    generarHorasDisponibles(12,20); 
    mesas.forEach(mesa => {
        let div = document.createElement("div");
        div.textContent = mesa;
        div.className = "rounded-3xl bg-black text-amber-600 w-20 h-20 flex justify-center items-center hover:scale-110 my-1";
        cuadro.appendChild(div);
    })
}
//Para no cambiar el orden cuando el usuario se arrepienta de una elección anterior vamos a volver a generar un input de fecha
function regenerarFecha(){
    let label = document.createElement("label");
    label.textContent = "Fecha reserva: ";
    let input = document.createElement("input");
    input.type = "date";
    input.className = "border";
    input.id = "fechaReserva";
    cuadro.appendChild(label);
    cuadro.appendChild(input);
}