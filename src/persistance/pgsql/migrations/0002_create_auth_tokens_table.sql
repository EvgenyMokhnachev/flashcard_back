CREATE TABLE auth_tokens
(
    token VARCHAR(255),
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

ALTER TABLE auth_tokens
    ADD CONSTRAINT auth_tokens_pk PRIMARY KEY (token);
