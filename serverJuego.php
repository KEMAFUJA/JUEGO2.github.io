<?php
require '-DATABASE.php'; 
header("Content-Type: application/json");

try {
    $pdo = Database::connect();
    $input = json_decode(file_get_contents("php://input"), true);


    if ($input['action'] === 'getTopScores') {
        try {
            $stmt = $pdo->prepare("SELECT nombre, puntos FROM puntaje ORDER BY puntos DESC LIMIT 10");
            $stmt->execute();
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            echo json_encode(["success" => true, "scores" => $scores]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "error" => "Error en la base de datos: " . $e->getMessage()]);
        }
        exit;
    }
    
    $nombre = $input['playerName'] ?? 'hola';
    $score = $input['score'] ?? 0;

    //if (!empty($nombre) && is_numeric($score)) {
        $stmt = $pdo->prepare("INSERT INTO puntaje (nombre, puntos) VALUES (:nombre, :score)");
        $stmt->execute([':nombre' => $nombre, ':score' => $score]);
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
    //} else {
    //    echo json_encode(["success" => false, "error" => "Datos inválidos."]);
    //}



} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error en la base de datos: " . $e->getMessage()]);
} finally {
    Database::disconnect();
}
?>
