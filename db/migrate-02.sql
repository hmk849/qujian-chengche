alter table users add column if not exists inbound_token text unique default encode(gen_random_bytes(12),'hex');
update users set inbound_token=encode(gen_random_bytes(12),'hex') where inbound_token is null;
