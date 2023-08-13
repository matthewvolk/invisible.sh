create table secrets (
  uuid text primary key,
  secret text not null
);

create table counter (
  name text primary key,
  count integer not null
);

insert into counter(name, count) values('generated', 0);
