CREATE TABLE companies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(200) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_companies (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id  UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, company_id)
);

INSERT INTO companies (name) VALUES
    ('SERVITAMEX SA DE CV'),
    ('CLOM PUBLICIDAD Y MAS SA DE CV'),
    ('XIMARW PUBLICIDAD'),
    ('BELIACOR SA DE CV'),
    ('G.I.V.E A LEASE SA DE CV'),
    ('EFFIMOVE LOGISTICS SA DE CV'),
    ('CONSULTORIA CPPS'),
    ('BTRAVEL REWARDS SA DE CV'),
    ('BRAN CORP S.A.'),
    ('Shenzhen Xunan Trading CO.LTD'),
    ('HAZ DE TU VIDA UNA FIESTA'),
    ('HANNAH SOFTWARE'),
    ('PH PRODUCTS'),
    ('CUSTOMIZE PRODUCT ASSOCIATION'),
    ('HUDSON BK MEXICO'),
    ('ARTICULOS PROMOCIONALES BRAND IN');
