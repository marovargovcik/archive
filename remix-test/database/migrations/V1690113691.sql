CREATE TABLE recipes (
    name TEXT PRIMARY KEY CHECK(length(name) <= 64),
    content TEXT NOT NULL,
    url TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tags (
    name TEXT PRIMARY KEY
);

CREATE TABLE recipeTags (
    recipeName TEXT,
    tagName TEXT,
    PRIMARY KEY (recipeName, tagName),
    FOREIGN KEY (recipeName) REFERENCES recipes(name) ON DELETE CASCADE,
    FOREIGN KEY (tagName) REFERENCES tags(name) ON DELETE CASCADE
);