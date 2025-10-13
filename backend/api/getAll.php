<?php

//datenbank zugangsdaten einbinden
require_once '../config.php';

//json aktivieren
header('Content-Type: application/json');

//verbindung mit Datenbank
try {
    //login auf datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

//sql statement schreiben
    $sql = "SELECT * FROM nyc_api";

    $stmt = $pdo->prepare($sql);
    

    //sql statement ausführen
    $stmt->execute();
    

    //daten in empfang nehmen
    $result = $stmt->fetchAll();

    //daten als json zurückgeben
    echo json_encode($results);





} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

