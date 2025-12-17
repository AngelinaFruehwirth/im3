<?php
require_once '../config.php';
header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    $borough = $_GET['borough'] ?? '';
    $allowedBoroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

    if (!in_array($borough, $allowedBoroughs)) {
        echo json_encode(['error' => 'Invalid borough']);
        exit;
    }

    $sql = "SELECT * FROM nyc_api WHERE borough = :borough";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['borough' => $borough]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
