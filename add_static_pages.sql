INSERT INTO menu_items (title, slug, type, content, is_active, sort_order)
VALUES 
  ('About Us', 'about-us', 'page', '<p>Your Text Here</p>', true, 1),
  ('Privacy Policy', 'privacy', 'page', '<p>Your Text Here</p>', true, 2),
  ('Disclaimer', 'disclaimer', 'page', '<p>Your Text Here</p>', true, 3),
  ('Terms and Conditions', 'terms', 'page', '<p>Your Text Here</p>', true, 4),
  ('Return Policy', 'return-policy', 'page', '<p>Your Text Here</p>', true, 5),
  ('Refund', 'refund', 'page', '<p>Your Text Here</p>', true, 6)
ON CONFLICT (slug) 
DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
