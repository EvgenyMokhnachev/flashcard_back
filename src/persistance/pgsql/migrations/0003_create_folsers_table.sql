CREATE SEQUENCE folders_id_seq;

CREATE TABLE folders
(
    id    INT NOT NULL,
    name VARCHAR(255),
    parent_id INT,
    user_id INT
);

ALTER TABLE folders
    ADD CONSTRAINT folders_pk PRIMARY KEY (id);

ALTER TABLE folders
    ADD CONSTRAINT folders_parent_id_fk FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE SET NULL;

ALTER TABLE folders
    ADD CONSTRAINT folders_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
