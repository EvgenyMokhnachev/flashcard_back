CREATE SEQUENCE users_id_seq;

CREATE TABLE users
(
    id    INT NOT NULL,
    email VARCHAR(255),
    pass VARCHAR(255)
);

ALTER TABLE users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);

ALTER TABLE users
    ADD CONSTRAINT users_email_uniq UNIQUE (email);
