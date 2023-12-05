USE usof_db;

DROP DATABASE IF EXISTS categories;

INSERT INTO usof_db.categories (category_title, category_description)
VALUES 
    ("General", "General discussions and questions"),
    ("Java", "Java programming language"),
    ("Python", "Python programming language"),
    ("JavaScript", "JavaScript programming language"),
    ("HTML/CSS", "Web development with HTML and CSS"),
    ("React", "React library and framework"),
    ("Redux", "JavaScript library for managing and centralizing application state"),
    ("SQL", "Structured Query Language "),
    ("Spring boot", "Tool that makes developing web application and microservices with Java Spring Framework faster and easier"),
    ("Gamedev", "Questions about gamedev"),
    ("C/C++", "System programming language"),
    ("Rust", "System programming language"),
    ("C#", "C# programming language"),
    ("Unity", "Cross-platform game engine developed by Unity Technologies"),
    ("Unreal Engine", "Series of 3D computer graphics game engines developed by Epic Games"),
    ("Windows", "A group of several proprietary graphical operating system families developed and marketed by Microsoft"),
    ("Linux", "Family of open-source Unix-like operating systems based on the Linux kernel"),
    ("Git", "Distributed version control system that tracks changes in any set of computer files, usually used for coordinating work among programmers"),
    ("Node.js", "Node.js runtime environment"),
    ("Database", "Database design and queries"),
    ("DevOps", "DevOps practices and tools"),
    ("Machine Learning", "Machine learning and artificial intelligence"),
    ("Mobile Development", "Mobile app development"),
    ("Security", "Cybersecurity and data protection");