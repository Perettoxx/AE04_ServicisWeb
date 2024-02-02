<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "ae04";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("La conexión ha fallado: " . $conn->connect_error);
}

// Obtener el parámetro de nombre enviado por GET
$nombre = $_GET['nombre'];

// Consulta SQL para recuperar los cócteles filtrados por nombre
$sql = "SELECT nombre, imagen, ingredientes, instrucciones FROM cocteles WHERE nombre LIKE '%$nombre%'";
$result = $conn->query($sql);

// Verificar si hay resultados
if ($result->num_rows > 0) {
    // Array para almacenar los cócteles
    $cocktails = array();

    // Recorrer los resultados y almacenar los cócteles en un array
    while ($row = $result->fetch_assoc()) {
        $cocktail = array(
            "nombre" => $row['nombre'],
            "imagen" => $row['imagen'],
            "instrucciones" => $row['instrucciones'],
            "ingredientes" => $row['ingredientes']
        );
        // Agregar el cóctel al array de cócteles
        $cocktails[] = $cocktail;
    }

    // Imprimir los cócteles en formato JSON
    echo json_encode($cocktails);
} else {
    echo "No se encontraron cócteles con el nombre proporcionado.";
}

// Cerrar la conexión
$conn->close();
?>
