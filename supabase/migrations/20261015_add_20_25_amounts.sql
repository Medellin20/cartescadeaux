begin;
alter table public.orders drop constraint if exists orders_amount_cents_check;
alter table public.orders add constraint orders_amount_cents_check check (
  amount_cents between 2000 * quantity and 100000 * quantity
  and amount_cents % (100 * quantity) = 0
);
commit;
