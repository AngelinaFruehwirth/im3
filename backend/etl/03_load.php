<?php

$data = include('02_transform.php');

require_once '../config.php';

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $sql = "INSERT INTO nyc_api (timestamp, borough, complaint_type, descriptor) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($data as $row) {
        $stmt->execute([
            $row['timestamp'],
            $row['borough'],
            $row['complaint_type'],
            $row['descriptor']
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}