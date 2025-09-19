-- Seed data for Warehouse Inspection Admin Panel

-- Insert sample users
INSERT INTO users (username, email, password_hash, full_name, role, phone) VALUES
('admin', 'admin@warehouse.com', '$2b$10$example_hash', 'System Administrator', 'Admin', '+1234567890'),
('inspector1', 'john.doe@warehouse.com', '$2b$10$example_hash', 'John Doe', 'Inspector', '+1234567891'),
('inspector2', 'jane.smith@warehouse.com', '$2b$10$example_hash', 'Jane Smith', 'Inspector', '+1234567892'),
('manager1', 'mike.johnson@warehouse.com', '$2b$10$example_hash', 'Mike Johnson', 'Manager', '+1234567893'),
('manager2', 'sarah.wilson@warehouse.com', '$2b$10$example_hash', 'Sarah Wilson', 'Manager', '+1234567894');

-- Insert sample warehouses
INSERT INTO warehouses (name, location, address, manager_id, capacity_tons, current_stock_tons) VALUES
('Central Warehouse A', 'New York', '123 Industrial Ave, New York, NY 10001', 4, 5000.00, 3200.50),
('Port Warehouse B', 'Los Angeles', '456 Harbor Blvd, Los Angeles, CA 90001', 5, 8000.00, 6100.25),
('Distribution Center C', 'Chicago', '789 Logistics Dr, Chicago, IL 60601', 4, 3500.00, 2800.75);

-- Insert sample commodities
INSERT INTO commodities (name, category, description, unit) VALUES
('Wheat', 'Grain', 'High-quality wheat for food production', 'tons'),
('Corn', 'Grain', 'Yellow corn for feed and food processing', 'tons'),
('Rice', 'Grain', 'Long grain white rice', 'tons'),
('Soybeans', 'Legume', 'Premium soybeans for oil and feed', 'tons'),
('Steel Coils', 'Metal', 'Cold-rolled steel coils for manufacturing', 'tons');

-- Insert sample inspection checklists
INSERT INTO inspection_checklists (name, description, commodity_id) VALUES
('Grain Quality Inspection', 'Standard quality check for grain commodities', 1),
('Metal Storage Inspection', 'Safety and quality check for metal products', 5),
('General Warehouse Inspection', 'Basic warehouse condition and safety check', NULL);

-- Insert checklist items for Grain Quality Inspection
INSERT INTO checklist_items (checklist_id, item_text, risk_level, order_index) VALUES
(1, 'Check for moisture content within acceptable limits', 'High', 1),
(1, 'Inspect for pest infestation or damage', 'Critical', 2),
(1, 'Verify proper ventilation systems are functioning', 'Medium', 3),
(1, 'Check storage temperature is within range', 'High', 4),
(1, 'Inspect for foreign material contamination', 'High', 5),
(1, 'Verify proper segregation from other commodities', 'Medium', 6);

-- Insert checklist items for Metal Storage Inspection
INSERT INTO checklist_items (checklist_id, item_text, risk_level, order_index) VALUES
(2, 'Check for rust or corrosion on metal surfaces', 'High', 1),
(2, 'Verify proper stacking and weight distribution', 'Critical', 2),
(2, 'Inspect lifting equipment and safety measures', 'Critical', 3),
(2, 'Check for proper protective covering', 'Medium', 4),
(2, 'Verify fire safety equipment is accessible', 'High', 5);

-- Insert checklist items for General Warehouse Inspection
INSERT INTO checklist_items (checklist_id, item_text, risk_level, order_index) VALUES
(3, 'Check structural integrity of building', 'Critical', 1),
(3, 'Inspect lighting and electrical systems', 'High', 2),
(3, 'Verify emergency exits are clear and marked', 'Critical', 3),
(3, 'Check cleanliness and housekeeping standards', 'Low', 4),
(3, 'Inspect security systems and access controls', 'Medium', 5),
(3, 'Verify proper documentation and record keeping', 'Medium', 6);

-- Insert sample inspections
INSERT INTO inspections (warehouse_id, commodity_id, inspector_id, checklist_id, inspection_date, status, overall_score, notes) VALUES
(1, 1, 2, 1, '2024-01-15', 'Completed', 85.50, 'Good overall condition, minor ventilation issues noted'),
(2, 5, 3, 2, '2024-01-16', 'Completed', 92.00, 'Excellent storage conditions and safety measures'),
(1, 2, 2, 1, '2024-01-17', 'In Progress', NULL, 'Inspection ongoing'),
(3, 3, 3, 1, '2024-01-18', 'Pending', NULL, 'Scheduled for inspection');
