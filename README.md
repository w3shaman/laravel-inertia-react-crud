# Laravel, Inertia, React CRUD

CRUD application using [Laravel](https://laravel.com/), [Inertia.js](https://inertiajs.com/), and [React](https://reactjs.org/).

This application is a simple backend for Content Management System. The content managed by this application contains the following fields:

* Title
* Body
* Image
* Publish  status
* Publish date

## Installation

Clone the repo locally:

```sh
git clone https://github.com/w3shaman/laravel-inertia-react-crud.git
cd laravel-inertia-react-crud
```

Install PHP dependencies:

```sh
composer install
```

Install NPM dependencies:

```sh
npm install
```

Build assets:

```sh
npm run dev
```

Setup configuration:

```sh
cp .env.example .env
```

Generate application key:

```sh
php artisan key:generate
```

Make public files accessible from the web:

```sh
php artisan storage:link
```

Run database migrations:

```sh
php artisan migrate
```

Run artisan server:

```sh
php artisan serve
```

[Run the application](http://127.0.0.1:8000/) in your browser.
