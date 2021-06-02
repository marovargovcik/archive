create type entity as enum ('movies', 'shows');

create type type as enum ('ratings', 'recommendations', 'watchlist');

create table users
(
    uuid           varchar(255) not null
        constraint users_uuid_uindex
        unique,
    "refreshToken" varchar(255) not null
        constraint "users_refreshToken_uindex"
        unique,
    slug           varchar(255) not null
);

create unique index users_slug_uindex
    on users (slug);

create table "userFollowers"
(
    "userUuid"     varchar(255) not null
        constraint "userFollowers_users_uuid_fk"
        references users (uuid)
        on delete cascade,
    "followerUuid" varchar(255) not null
        constraint "userFollowers_users_uuid_fk_2"
        references users (uuid)
        on delete cascade,
    constraint "userFollowers_userUuid_followerUuid_uindex"
        unique ("userUuid", "followerUuid")
);

create table "userActivityLogs"
(
    uuid        varchar(40)                         not null
        constraint "userActivityLogs_uuid_uindex"
        unique,
    type        type                                not null,
    "createdAt" timestamp default CURRENT_TIMESTAMP not null,
    "userUuid"  varchar(255)                        not null
        constraint "userActivityLogs_users_uuid_fk"
        references users (uuid)
        on delete cascade,
    entity      entity                              not null,
    slug        varchar(255)                        not null,
    payload     json
);

