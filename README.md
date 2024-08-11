```
  ▶ Eternals API
```

---

## Summary

Eternals API is a service for eternal games, helping users interact with this game more easily

## Requisite

- Node 18+

## Quick start

<summary>Install dependencies</summary>

```sh
yarn install
```

</details>

<details open="">
<summary>Setup environment variables</summary>

Copy `.env_example` to `.env` and adjust the value.

```sh
cp .env_example .env
```

<details open="">
<summary>Run local environment</summary>

```sh
yarn dev
```

</details>

<details open="">
<summary>Build the application</summary>

```sh
yarn build
```

</details>

## Environment variables

| Name         | Required | Default | Description                            |
| ------------ | -------- | ------- | -------------------------------------- |
| PORT         | no       | `3000`  | HTTP server port                       |
| SECRET_TOKEN | yes      | -       | The token when log in in eternals game |
