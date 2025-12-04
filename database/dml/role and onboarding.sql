-- Insertar tipos de onboarding
INSERT INTO onboarding_type (name, description, created_at, updated_at) 
VALUES 
    ('Onboarding de Bienvenida General', 'Onboarding de Bienvenida General', '2025-12-02 17:54:02.914', '2025-12-02 17:54:02.914'),
    ('Onboarding Técnico', 'Como Journey to Cloud u otro', '2025-12-02 17:54:02.920', '2025-12-02 17:54:02.920');

-- Insertar roles
INSERT INTO role (name, description, created_at, updated_at) 
VALUES 
    ('Admin', 'Usuario con todos los permisos', '2025-12-02 17:51:01.925', '2025-12-02 17:51:01.925'),
    ('Colaborador', 'Usuario que realiza onboardings', '2025-12-02 17:51:01.925', '2025-12-02 17:51:01.925');


INSERT INTO onboarding (name, description, start_date, onboarding_type_id, end_date, color)
VALUES
-- ======================
-- 5 ONBOARDINGS DE BIENVENIDA (TYPE = 1)
-- ======================
('Inducción Corporativa',
'Sesión introductoria sobre la misión, visión y valores del Banco de Bogotá.',
'2025-01-10 09:00:00',
1,
'2025-01-10 12:00:00',
'#003DA5'),

('Bienvenida y Cultura Organizacional',
'Presentación del entorno laboral, normas internas y beneficios para colaboradores.',
'2025-01-11 09:00:00',
1,
'2025-01-11 11:30:00',
'#0052CC'),

('Tour de Herramientas Institucionales',
'Introducción a las plataformas internas y recursos de soporte.',
'2025-01-12 14:00:00',
1,
'2025-01-12 16:00:00',
'#4A90E2'),

('Reunión de Bienvenida con el Equipo',
'Espacio para conocer a líderes, compañeros y procesos del área.',
'2025-01-13 10:00:00',
1,
'2025-01-13 11:00:00',
'#1E90FF'),

('Presentación de Políticas y Cumplimiento',
'Revisión de pautas de seguridad, políticas de información y lineamientos legales.',
'2025-01-15 08:30:00',
1,
'2025-01-15 10:30:00',
'#2E5AAC'),

-- ======================
-- 10 ONBOARDINGS TÉCNICOS (TYPE = 2)
-- ======================
('Capacitación Core Bancario',
'Formación técnica sobre los sistemas principales del banco.',
'2025-01-16 09:00:00',
2,
'2025-01-16 13:00:00',
'#A020F0'),

('Entrenamiento en Seguridad Informática',
'Buenas prácticas, phishing, gestión de claves y accesos.',
'2025-01-17 08:00:00',
2,
'2025-01-17 11:00:00',
'#8A2BE2'),

('Formación en Gestión Documental',
'Uso de sistemas de archivo, radicación y trazabilidad.',
'2025-01-18 14:00:00',
2,
'2025-01-18 17:00:00',
'#7B68EE'),

('Capacitación CRM Institucional',
'Entrenamiento en el uso del CRM para atención de clientes.',
'2025-01-19 09:00:00',
2,
'2025-01-19 12:00:00',
'#6A5ACD'),

('Manejo de Herramientas de Reportes',
'Uso avanzado de Power BI, consultas y tableros.',
'2025-01-20 13:00:00',
2,
'2025-01-20 17:00:00',
'#9932CC'),

('Procedimientos de Atención al Cliente',
'Protocolos operativos, flujo de casos y escalamiento.',
'2025-01-21 10:00:00',
2,
'2025-01-21 12:00:00',
'#BA55D3'),

('Gestión de Operaciones Internas',
'Procesos internos para aprobaciones, seguimiento y control.',
'2025-01-22 08:00:00',
2,
'2025-01-22 11:30:00',
'#DA70D6'),

('Capacitación en Sistemas de Pago',
'Fundamentos técnicos de transferencias, ACH y compensación.',
'2025-01-23 09:00:00',
2,
'2025-01-23 12:00:00',
'#D8BFD8'),

('Taller de Automatización Interna',
'Introducción a RPA, bots internos y flujos automatizados.',
'2025-01-24 14:00:00',
2,
'2025-01-24 17:00:00',
'#C71585'),

('Entrenamiento en Gestión de Riesgo',
'Metodologías internas, matrices de riesgo y herramientas.',
'2025-01-25 08:00:00',
2,
'2025-01-25 11:00:00',
'#FF1493');
 