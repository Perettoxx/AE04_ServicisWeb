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

// Obtener los datos enviados por POST
$nombre = $_POST['nombre'];
$imagen = $_POST['imagen'];
$ingredientes = $_POST['ingredientes'];
$instrucciones = $_POST['instrucciones'];

// Verificar si ya existe un cóctel con el mismo nombre
$sql_check = "SELECT nombre FROM cocteles WHERE nombre = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $nombre);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo "Ya existe un cóctel con el mismo nombre";
} else {
    // Preparar la consulta SQL para la inserción
    $sql_insert = "INSERT INTO cocteles (nombre, imagen, ingredientes, instrucciones) VALUES (?, ?, ?, ?)";

    // Preparar la declaración
    $stmt_insert = $conn->prepare($sql_insert);

    // Vincular parámetros
    $stmt_insert->bind_param("ssss", $nombre, $imagen, $ingredientes, $instrucciones);

    // Ejecutar la declaración
    if ($stmt_insert->execute()) {
        echo "Cóctel guardado correctamente";
    } else {
        echo "Error al guardar el cóctel: " . $conn->error;
    }

    // Cerrar la declaración de inserción
    $stmt_insert->close();
}

// Cerrar la declaración de verificación y la conexión
$stmt_check->close();
$conn->close();
?>
