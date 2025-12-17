<?php

//datenbank zugangsdaten einbinden
require_once '../config.php';

//json aktivieren
header('Content-Type: application/json');

//verbindung mit Datenbank
try {
    //login auf datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

    $today = date('Y-m-d');

//sql statement schreiben
    $sql = "SELECT * FROM nyc_api WHERE DATE (timestamp) = :today";

    $stmt = $pdo->prepare($sql);
    

    //sql statement ausführen
    $stmt->execute([ 'today' => $today ]);
    

    //daten in empfang nehmen
    $result = $stmt->fetchAll();

    //daten als json zurückgeben
    echo json_encode($result);


} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

