<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Простой тест подключения к БД
try {
    $pdo = new PDO(
        "pgsql:host=postgres;dbname=smarta_mintrud_courses", 
        "postgres", 
        "12345678"
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo json_encode([
        "status" => "success", 
        "message" => "✅ Бекенд работает! Подключение к базе данной произведено успешно.",
        "timestamp" => date('Y-m-d H:i:s')
    ]);
    
} catch (PDOException $err) {
    echo json_encode([
        "status" => "error", 
        "message" => "Ошибка соединения с базой данных: " . $err->getMessage()
    ]);
}
?>