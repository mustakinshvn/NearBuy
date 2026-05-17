CREATE TABLE IF NOT EXISTS admin_users (
  admin_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'superadmin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_settings (
  setting_key VARCHAR(120) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_by_admin_id INT NULL REFERENCES admin_users(admin_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_settings (setting_key, setting_value)
VALUES
  ('app_name', 'NearBuy'),
  ('support_email', 'support@nearbuy.com'),
  ('currency', 'BDT'),
  ('maintenance_mode', 'false'),
  ('banner_message', 'Welcome to the NearBuy admin panel'),
  ('default_commission_rate', '0')
ON CONFLICT (setting_key) DO NOTHING;