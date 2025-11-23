<?php
require_once __DIR__ . '/cors.php';

$db_host = getenv('DB_HOST') ?: 'postgres';
$db_name = getenv('DB_NAME') ?: 'smarta_mintrud_courses';
$db_user = getenv('DB_USER') ?: 'postgres';
$db_password = getenv('DB_PASSWORD') ?: '12345678';
$db_port = getenv('DB_PORT') ?: 5432;

try {
    $datasourceName = sprintf('pgsql:host=%s;port=%d;dbname=%s', $db_host, $db_port, $db_name);
    $pdo = new PDO(
        $datasourceName, 
        $db_user, 
        $db_password, 
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // Тестируем подключение
    $pdo->query('SELECT 1 AS test');

} catch(PDOException $err) {
    error_log('Ошибка соединения с БД: ' . $err->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Не удалось подключиться к базе данных!',
        'debug' => defined('DEBUG') ? $err->getMessage() : null
    ]);
    exit();
}

?>