-- public.onboarding_type definition

-- Drop table
-- DROP TABLE onboarding_type;

CREATE TABLE onboarding_type (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    name varchar(255) NOT NULL,
    description text NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp NULL,
    CONSTRAINT onboarding_type_pk PRIMARY KEY (id)
);

-- public.role definition

-- Drop table
-- DROP TABLE role;

CREATE TABLE role (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    name varchar(255) NOT NULL,
    description text NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp NULL,
    CONSTRAINT role_pk PRIMARY KEY (id),
    CONSTRAINT role_unique UNIQUE (name)
);

-- public.onboarding definition

-- Drop table
-- DROP TABLE onboarding;

CREATE TABLE onboarding (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    name varchar(255) NOT NULL,
    description text NULL,
    start_date timestamp NULL,
    onboarding_type_id bigint NOT NULL,
    end_date timestamp NULL,
    color varchar(10) NOT NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp NULL,
    CONSTRAINT onboarding_pk PRIMARY KEY (id),
    CONSTRAINT onboarding_onboarding_type_fk FOREIGN KEY (onboarding_type_id) REFERENCES onboarding_type(id)
);

-- public.user definition

-- Drop table
-- DROP TABLE "user";

CREATE TABLE "user" (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(300) NOT NULL,
    entry_date timestamp NOT NULL,
    role_id bigint NOT NULL,
    password text NOT NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp NULL,
    CONSTRAINT user_pk PRIMARY KEY (id),
    CONSTRAINT user_role_fk FOREIGN KEY (role_id) REFERENCES role(id)
);

-- public.user_onboarding definition

-- Drop table
-- DROP TABLE user_onboarding;

CREATE TABLE user_onboarding (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    user_id bigint NOT NULL,
    onboarding_id bigint NOT NULL,
    state bit(1) NOT NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp NULL,
    CONSTRAINT user_onboarding_pk PRIMARY KEY (id),
    CONSTRAINT user_onboarding_onboarding_fk FOREIGN KEY (onboarding_id) REFERENCES onboarding(id),
    CONSTRAINT user_onboarding_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);