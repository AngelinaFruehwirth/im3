<?php

//datenbank zugangsdaten einbinden
require_once '../config.php';

//json aktivieren
header('Content-Type: application/json');

//verbindung mit Datenbank
try {
    //login auf datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

    $borough = $_GET['borough'];

$borough = $_GET['borough'] ?? '';
$allowedBoroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

if (!in_array($borough, $allowedBoroughs)) {
    echo json_encode(['error' => 'Invalid borough']);
    exit;
}

//sql statement schreiben
    $sql = "SELECT * FROM nyc_api WHERE borough = :borough";

    $stmt = $pdo->prepare($sql);
    

    //sql statement ausführen
    $stmt->execute([ 'borough' => $borough ]);
    

    //daten in empfang nehmen
    $result = $stmt->fetchAll();

    //daten als json zurückgeben
    echo json_encode($result);

} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

