<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::match(['get', 'post'], '/', 'App\Http\Controllers\ContentController@index')->name('content.index');
Route::match(['get', 'post'], '/add', 'App\Http\Controllers\ContentController@add')->name('content.add');
Route::match(['get', 'post'], '/edit/{id}', 'App\Http\Controllers\ContentController@edit')->name('content.edit')->middleware('content_exists');
Route::match(['get', 'post'], '/delete/{id}', 'App\Http\Controllers\ContentController@delete')->name('content.delete')->middleware('content_exists');
