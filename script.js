async function cargarDesdeCSV() {
    try {
        const response = await fetch("datos.csv");
        if (!response.ok) throw new Error("No se pudo cargar el archivo CSV.");

        const data = await response.text();
        const lineas = data.trim().split("\n");
        const headers = lineas[0].split(",");

        let tablaHTML = "";
        for (let i = 1; i < lineas.length; i++) {
            let fila = lineas[i].split(",");
            if (fila.length === headers.length) {
                tablaHTML += `<tr>
                    <td>${fila[0]}</td>  <!-- Modelo -->
                    <td>${fila[1]}</td>  <!-- MP -->
                    <td>${fila[4]}</td>  <!-- Tipo -->
                    <td>${fila[2]}</td>  <!-- Uso (Exterior/Interior) -->
                    <td>${fila[7]}</td>  <!-- Alcance IR (m) -->
                    <td>${fila[10]}</td> <!-- Precio aprox. (COP) -->
                </tr>`;
            }
        }

        document.querySelector("#tablaCamaras tbody").innerHTML = tablaHTML;
    } catch (error) {
        console.error("Error cargando el CSV:", error);
    }
}

// Llamar a la función para cargar los datos al abrir la página
cargarDesdeCSV();
