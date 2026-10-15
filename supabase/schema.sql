create extension if not exists pgcrypto;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  quantity int not null default 1 check (quantity between 1 and 20),
  amount_cents int not null,
  constraint orders_amount_cents_check check (amount_cents between 2000 * quantity and 100000 * quantity and amount_cents % (100 * quantity) = 0),
  currency text not null default 'EUR',
  brand text,
  buyer_name text,
  buyer_email text not null,
  recipient_name text,
  recipient_email text,
  message text,
  status text not null default 'pending' check (status in ('pending','paid','failed','mismatch')),
  sumup_checkout_id text unique,
  sumup_transaction_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  email_sent_at timestamptz
);

create table public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  order_id uuid references public.orders(id),
  position int not null default 1 check (position between 1 and 20),
  unique (order_id, position),
  initial_cents int not null,
  balance_cents int not null check (balance_cents >= 0),
  status text not null default 'active' check (status in ('active','disabled')),
  created_at timestamptz not null default now()
);

create table public.card_transactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.gift_cards(id) on delete cascade,
  delta_cents int not null,
  type text not null,
  note text,
  created_at timestamptz not null default now()
);

-- RLS activée SANS politique : seul le service_role (serveur) peut accéder aux données.
alter table public.orders enable row level security;
alter table public.gift_cards enable row level security;
alter table public.card_transactions enable row level security;

-- Débit / crédit atomique (verrou de ligne, solde jamais négatif grâce au CHECK)
create or replace function public.adjust_card(p_card_id uuid, p_delta int, p_type text, p_note text)
returns int language plpgsql security definer set search_path = public as $$
declare new_bal int;
begin
  update gift_cards set balance_cents = balance_cents + p_delta
   where id = p_card_id and status = 'active'
   returning balance_cents into new_bal;
  if new_bal is null then raise exception 'card_not_found_or_disabled'; end if;
  insert into card_transactions(card_id, delta_cents, type, note) values (p_card_id, p_delta, p_type, p_note);
  return new_bal;
end $$;

revoke all on function public.adjust_card(uuid,int,text,text) from public, anon, authenticated;
grant execute on function public.adjust_card(uuid,int,text,text) to service_role;
