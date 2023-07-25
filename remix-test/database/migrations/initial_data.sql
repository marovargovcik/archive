DELETE FROM recipeTags;
DELETE FROM recipes;
DELETE FROM tags;

INSERT INTO recipes (name,content,url,createdAt) VALUES
	 ('The Easiest Chili Garlic Noodles Ever (3 Ways)','My favorite chili garlic noodles, with an ~optional~ homemade noodle recipe. Have a great day pal.','https://www.joshuaweissman.com/post/chili-garlic-noodles','2023-07-25 10:22:50'),
	 ('I Invented A New Chicken Parmesan','Was Chicken Parm really supposed to be Italian-American? One hint: think Buldak...but (better) chicken parm.','https://www.joshuaweissman.com/post/korean-chicken-parm','2023-07-25 10:25:40'),
	 ('The 200 Hour Burrito','A burrito is normally something quick. So what happens if we do everything to squeeze every last bit of flavor out of it?','https://www.joshuaweissman.com/post/200hourburrito','2023-07-25 10:25:40');
INSERT INTO recipeTags (recipeName,tagName) VALUES
	 ('The Easiest Chili Garlic Noodles Ever (3 Ways)','spicy'),
	 ('The Easiest Chili Garlic Noodles Ever (3 Ways)','saucy'),
	 ('I Invented A New Chicken Parmesan','chicken'),
	 ('I Invented A New Chicken Parmesan','saucy'),
	 ('The 200 Hour Burrito','mexican'),
	 ('The 200 Hour Burrito','spicy'),
	 ('The 200 Hour Burrito','beef');
INSERT INTO tags (name) VALUES
	 ('spicy'),
	 ('saucy'),
	 ('chicken'),
	 ('beef'),
	 ('mexican');
