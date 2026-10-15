-- À exécuter sur une base existante avant de déployer le catalogue.
alter table public.orders add column if not exists brand text;
