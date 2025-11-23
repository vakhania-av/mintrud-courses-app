<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/config.php';

// GET - Получение всех комбинаций с курсами
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Используем постгресовую функцию json_agg и COALESCE для пустых комбинаций.
        // На всякий случай добавим JSON_UNESCAPED_UNICODE для лучшей обработки русского текста.
        $query = '
            SELECT
                cc.id,
                cc.combination_name,
                cc.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            \'id\', c.id,
                            \'code\', c.code,
                            \'title\', c.title,
                            \'position\', cc2.position
                        ) ORDER BY cc2.position
                    ) FILTER (WHERE c.id IS NOT NULL),
                    \'[]\'::json
                ) AS courses
            FROM course_combinations cc
            LEFT JOIN combination_courses cc2 ON cc.id = cc2.combination_id
            LEFT JOIN courses c ON cc2.course_id = c.id
            GROUP BY cc.id, cc.combination_name, cc.created_at
            ORDER BY cc.created_at DESC
            LIMIT 100
        ';

        $statement = $pdo->query($query);
        // Получаем комбинации
        $combinations = $statement->fetchAll();

        // Парсим JSON для каждой комбинации
        foreach($combinations as &$combination) {
            $combination['courses'] = json_decode($combination['courses'], true) ?: [];
        }

        // Возвращаем код успешного выполнения и результат
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'combinations' => $combinations,
            'count' => count($combinations)
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $err) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $err->getMessage()
        ]);
    }

    exit();
}

// POST - Создание комбинации
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['name']) || !isset($data['courses'])) {
            throw new Exception('Отсутствуют необходимые поля: name, courses');
        }

        if (count($data['courses']) > 3) {
            throw new Exception('Недопустимо использовать более 3-х курсов на комбинацию!');
        }

        if (count($data['courses']) === 0) {
            throw new Exception('Для комбинации необходим как минимум один курс!');
        }

        // Валидируем, что все курсы существуют
        $courseIds = array_map(function ($currentCourse) {
            return $currentCourse['id'];
        }, $data['courses']);

        $placeholders = implode(',', array_fill(0, count($courseIds), '?'));
        // Подготавливаем запрос
        $statement = $pdo->prepare("SELECT COUNT(*) AS count FROM courses WHERE id IN ($placeholders)");
        $statement->execute($courseIds);

        $result = $statement->fetch();

        if ((int)$result['count'] != count($courseIds)) {
            throw new Exception('Внимание! Не найдены один или несколько курсов!');
        }

        // Начинаем транзакцию
        $pdo->beginTransaction();

        try {
            // 1. Вставляем комбинацию
            $statement = $pdo->prepare('INSERT INTO course_combinations (combination_name) VALUES (:name) RETURNING id, combination_name, created_at');
            $statement->execute([':name' => $data['name']]);

            $combination = $statement->fetch();
            // 2. Вставляем связи курсов
            $statement = $pdo->prepare('INSERT INTO combination_courses (combination_id, course_id, position) VALUES (:combination_id, :course_id, :position)');

            // Пробежим циклом по курсам, где ключ - позиция, а значение - курс
            foreach($data['courses'] as $position => $course) {
                $statement->execute([
                    ':combination_id' => $combination['id'],
                    ':course_id' => $course['id'],
                    ':position' => $position
                ]);
            }

            // Коммитим транзакцию
            $pdo->commit();

            // Добавляем курсы к ответу
            $combination['courses'] = $data['courses'];

            // Возвращаем статус и успешный ответ
            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'combination' => $combination,
                'message' => 'Комбинация успешно создана!'
            ]);
        } catch (Exception $err) {
            $pdo->rollBack();
            throw $err;
        }
    } catch (Exception $err) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $err->getMessage()
        ]);
    }

    exit();
}

// DELETE - Удаление комбинации
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Распарсим строку URL
        $url_parts = parse_url($_SERVER['REQUEST_URI']);
        $path = $url_parts['path'] ?? '';

        $path_parts = explode('/', $path);
        $id = end($path_parts);

        if (empty($id) || $id === 'combinations') {
            parse_str($_SERVER['QUERY_STRING'] ?? '', $query_params);
            $id = $query_params['id'] ?? null;
        }
        

        if (!$id || !is_numeric($id)) {
            throw new Exception('Комбинация ID неверна, либо отсутствует');
        }

        $statement = $pdo->prepare('DELETE FROM course_combinations WHERE id = :id');
        $statement->execute([':id' => $id]);

        if ($statement->rowCount() === 0) {
            throw new Exception('Комбинация отсутствует');
        }

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Комбинация успешно удалена!'
        ]);
    } catch (Exception $err) {
        http_response_code(400);
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