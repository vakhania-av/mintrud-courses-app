-- Таблица курсов (справочник)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    external_id INT UNIQUE NOT NULL,
    code VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица комбинаций (заголовок)
CREATE TABLE IF NOT EXISTS course_combinations (
    id SERIAL PRIMARY KEY,
    combination_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица связей (многие-ко-многим)
CREATE TABLE IF NOT EXISTS combination_courses (
    id SERIAL PRIMARY KEY,
    combination_id INTEGER NOT NULL REFERENCES course_combinations(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Уникальная комбинация (т.к. один курс не может быть дважды в одной комбинации)
    UNIQUE(combination_id, course_id)
);

-- Формируем индексы для быстрого поиска
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_external_id ON courses(external_id);
CREATE INDEX idx_combination_courses_combination_id ON combination_courses(combination_id);
CREATE INDEX idx_combination_courses_course_id ON combination_courses(course_id);
CREATE INDEX idx_combinations_created ON course_combinations(created_at DESC);

-- Таблица для логирования
CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INT,
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_logs_created ON api_logs(created_at DESC);
