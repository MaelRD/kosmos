INSERT INTO members (name, color_hex) VALUES
    ('Nova', '#9B7BFF'),
    ('Orión', '#3E8EDE'),
    ('Vega', '#FFCB3D'),
    ('Lyra', '#FF6FA5'),
    ('Kepler', '#2EC4B6');

INSERT INTO labels (name) VALUES
    ('Navegación'),
    ('Propulsión'),
    ('Comunicaciones'),
    ('Soporte vital'),
    ('Científico'),
    ('Cartografía');

INSERT INTO tasks (id, title, description, type, priority, assignee_name, board_column, points, label_name, resolution_days, position) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Calibrar sensores de largo alcance', '', 'TASK', 'HIGH', 'Orión', 'TODO', 3, 'Navegación', NULL, 0),
    ('00000000-0000-0000-0000-000000000002', 'Trazar ruta al cúmulo de Perseo', '', 'STORY', 'MEDIUM', 'Nova', 'TODO', 5, 'Cartografía', NULL, 1),
    ('00000000-0000-0000-0000-000000000003', 'Optimizar consumo de combustible de iones', '', 'TASK', 'MEDIUM', 'Vega', 'TODO', 2, 'Propulsión', NULL, 2),
    ('00000000-0000-0000-0000-000000000004', 'Diseñar hábitat para tripulación en Europa', '', 'STORY', 'LOW', 'Vega', 'TODO', 8, 'Soporte vital', NULL, 3),
    ('00000000-0000-0000-0000-000000000005', 'Fuga de energía en el motor de curvatura', '', 'BUG', 'CRITICAL', 'Kepler', 'PROGRESS', 5, 'Propulsión', NULL, 0),
    ('00000000-0000-0000-0000-000000000006', 'Actualizar protocolo de comunicación cuántica', '', 'TASK', 'MEDIUM', 'Lyra', 'PROGRESS', 3, 'Comunicaciones', NULL, 1),
    ('00000000-0000-0000-0000-000000000007', 'Falla en el escudo de radiación', '', 'BUG', 'HIGH', 'Kepler', 'PROGRESS', 3, 'Soporte vital', NULL, 2),
    ('00000000-0000-0000-0000-000000000008', 'Sincronizar reloj atómico de la nave nodriza', '', 'TASK', 'MEDIUM', 'Orión', 'REVIEW', 2, 'Navegación', NULL, 0),
    ('00000000-0000-0000-0000-000000000009', 'Mapear campo de asteroides del cinturón', '', 'STORY', 'HIGH', 'Nova', 'REVIEW', 8, 'Cartografía', NULL, 1),
    ('00000000-0000-0000-0000-000000000010', 'Análisis espectral de exoplaneta Kepler-22b', '', 'STORY', 'MEDIUM', 'Lyra', 'DONE', 5, 'Científico', 4, 0),
    ('00000000-0000-0000-0000-000000000011', 'Reparar antena de comunicación profunda', '', 'BUG', 'HIGH', 'Orión', 'DONE', 3, 'Comunicaciones', 2, 1),
    ('00000000-0000-0000-0000-000000000012', 'Documentar protocolo de primer contacto', '', 'TASK', 'LOW', 'Nova', 'DONE', 1, 'Científico', 1, 2);
