# Poolder Case

> A simple transaction dashboard using Next.js and Supabase

![Alt text](image-1.png)

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)

## Setup

First, make sure your .env file is set up with the following variables:

```sh
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Then set up your Supabase project with the following table:

```sql
CREATE TABLE public."Transactions" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    title character varying not null,
    description text not null,
    value bigint not null,
    constraint Transactions_pkey primary key (id)
  ) tablespace pg_default;
```

See [Supabase](https://supabase.io/) for more information.

Then, run the following commands to start the application:

```sh
npm install
npm run build
npm run start
```

## Usage

The application will be available at [http://localhost:3000](http://localhost:3000).

You can add transactions by clicking the "Add Transaction" button and filling out the form.
![Alt text](image.png)
