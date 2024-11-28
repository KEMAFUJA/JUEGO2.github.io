<?php
class Database {
    private static $dbName = 'NOTARIA_N135'; // Nombre de la base de datos
    //private static $dbHost = '192.168.1.4'; // not
    //private static $dbHost = ' 192.168.0.11'; // laptop
    private static $dbHost = ' 192.168.56.1'; // laptop local
    //private static $dbHost = ' 192.168.0.24'; // server casa
    private static $dbUsername = 'postgres'; // Usuario de la base de datos
    private static $dbUserPassword = 'Queteimporta'; // Contraseña de la base de datos
    private static $cont = null;

    public function __construct() {
        die('Init function is not allowed');
    }

    public static function connect() {
        // Una conexión para toda la aplicación
        if (null == self::$cont) {
            try {
                self::$cont =  new PDO("pgsql:host=" . self::$dbHost . ";" . "dbname=" . self::$dbName, self::$dbUsername, self::$dbUserPassword);
                self::$cont->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Configuración de manejo de errores
            } catch (PDOException $e) {
                die($e->getMessage());
            }
        }
        return self::$cont;
    }

    public static function disconnect() {
        self::$cont = null;
    }
}
/*
try {
    $db = Database::connect();

    $querySelect = 'SELECT * FROM usuarios WHERE nombre = :nombre AND contra = :contra';
                $stmtSelect = $db->prepare($querySelect);
                $username='ADMIN';
                $password='ADMIN.123';
                $stmtSelect->bindParam(':nombre', $username, PDO::PARAM_STR);
                $stmtSelect->bindParam(':contra', $password, PDO::PARAM_STR);
                $stmtSelect->execute();

                $result = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    // Ejemplo de inserción
    /*$sqlInsert = "INSERT INTO USERS (COD_CLI, ROL, NOMBRE, PASS) VALUES (:codcli, :rol, :nombre, :pass)";
                $stmtInsert = $db->prepare($sqlInsert);

                
	// Variables a insertar
	$codcli = '1';
	$nombre = 'YOLO'; // Fecha en formato 'YYYY-MM-DD'
	$pass = 'YOLO123'; // Hora en formato 'HH:MM:SS'
	
	// Consulta para obtener el nombre del cliente
    $querySelect = "SELECT rol FROM persona WHERE cod = :codcli";
    $stmtSelect = $db->prepare($querySelect);
    $stmtSelect->bindParam(':codcli', $codcli, PDO::PARAM_STR);
    $stmtSelect->execute();

    // Obtener el resultado de la consulta
    $resultado = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    if ($resultado) {
        $rol = $resultado['rol']; // Asignar el nombre del cliente obtenido de la consulta
    } else {
        die("Error: No se encontró el cliente con el código $codcli");
    }

    // Asignación de parámetros para la inserción
    $stmtInsert->bindParam(':codcli', $codcli, PDO::PARAM_STR);
    $stmtInsert->bindParam(':rol', $rol, PDO::PARAM_STR);
    $stmtInsert->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmtInsert->bindParam(':pass', $pass, PDO::PARAM_STR);
    
                    
    if ($stmtSelect->execute()) {
        echo "<script>alert('Agregado CORRECTAMENTE!');</script>";
        // Redirigir después de la actualización
        header("Location: MENU.php");
        exit();
    } else {
        // Obtener información sobre el error
        $errorInfo = $stmtSelect->errorInfo();
        die("Error al actualizar en la tabla USUARIOS: " . $errorInfo[2]);
    }

    // Ejemplo de consulta SELECT para mostrar resultados
    /*$querySelect = "SELECT * FROM users";
    $stmtSelect = $db->query($querySelect);

    // Mostrar los resultados en una tabla HTML
    echo "<table border='1'>
            <tr><th>COD</th><th>COD_CLI</th><th>ROL</th><th>NOMBRE</th><th>PASS</th></tr>";
    while ($row = $stmtSelect->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr><td>{$row['cod']}</td>
                <td>{$row['cod_cli']}</td>
                <td>{$row['rol']}</td>
                <td>{$row['nombre']}</td>
                <td>{$row['pass']}</td></tr>";
    }
    echo "</table>";
    echo "Conexión exitosa";

    // Desconectar de la base de datos
    Database::disconnect();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}*/
?>