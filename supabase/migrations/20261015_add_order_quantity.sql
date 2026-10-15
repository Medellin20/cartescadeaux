begin;
alter table public.orders add column if not exists quantity int not null default 1 check (quantity between 1 and 20);
alter table public.orders drop constraint if exists orders_amount_cents_check;
alter table public.orders add constraint orders_amount_cents_check check (
  amount_cents between 5000 * quantity and 100000 * quantity
  and amount_cents % (100 * quantity) = 0
);
alter table public.gift_cards add column if not exists position int not null default 1 check (position between 1 and 20);
alter table public.gift_cards drop constraint if exists gift_cards_order_id_key;
alter table public.gift_cards add constraint gift_cards_order_id_position_key unique (order_id, position);
commit;
