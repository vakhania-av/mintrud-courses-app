<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получаем данные с API Минтруда
    try {
        $response = file_get_contents('https://edu.rosmintrud.ru/api/Reference/GetLearnProgram?IsActive=true');

        if (!$response) {
            throw new Exception('Не удалось получить данные из API РосМинТруда');
        }

        $data = json_decode($response, true);

        if (!isset($data['learnPrograms'])) {
            throw new Exception('Неверный формат ответа от API');
        }

        // Сохраняем/обновляем курсы в БД
        foreach($data['learnPrograms'] as $course) {
            // Формируем конструкцию запроса
            $statement = $pdo->prepare('
                INSERT INTO courses (external_id, code, title)
                VALUES (:id, :code, :title)
                ON CONFLICT (external_id) DO UPDATE
                SET code = :code, title = :title
            ');
            // Задаём бинды
            $binds = [
                ':id' => $course['id'],
                ':code' => $course['code'],
                ':title' => $course['title']
            ];

            $statement->execute($binds);
        }

        // Возвращаем все курсы из БД
        $statement = $pdo->query('
            SELECT * FROM courses
            ORDER BY code ASC
        ');
        $courses = $statement->fetchAll();

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'courses' => $courses,
            'count' => count($courses)
        ]);

    } catch (Exception $err) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $err->getMessage()
        ]);
    }

    exit();
}

http_response_code(405);
echo json_encode([
    'status' => 'error',
    'message' => 'Не допускается использование данного метода!'
]);
?>