CREATE SEQUENCE cards_id_seq;

CREATE TABLE cards
(
    id    INT NOT NULL,
    folder_id INT,
    user_id INT,
    front_side TEXT,
    back_side TEXT,
    difficult INT,
    difficult_change_time TIMESTAMP,
    created_at TIMESTAMP,
    bookmarked boolean
);

ALTER TABLE cards
    ADD CONSTRAINT cards_pk PRIMARY KEY (id);

ALTER TABLE cards
    ADD CONSTRAINT cards_folder_id_fk FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE RESTRICT;

ALTER TABLE cards
    ADD CONSTRAINT cards_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
