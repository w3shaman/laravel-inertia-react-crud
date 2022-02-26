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
Route::get('/add', 'App\Http\Controllers\ContentController@add')->name('content.add');
Route::post('/add', 'App\Http\Controllers\ContentController@addSubmit')->name('content.add.submit');

/**
 * Automatically inject Content Model to controller function on edit and delete confirmation page.
 * the parameter name should match the model classname in lowercase and "id" field is assumed as the key.
 *
 * By injecting the Content Model the application will automatically display 404 Not Found page if the
 * requested content is not exist so we don't need to check that manually.
 */
Route::get('/edit/{content}', 'App\Http\Controllers\ContentController@edit')->name('content.edit');
Route::post('/edit/{content}', 'App\Http\Controllers\ContentController@editSubmit')->name('content.edit.submit');
Route::get('/delete/{content}', 'App\Http\Controllers\ContentController@delete')->name('content.delete');
Route::post('/delete/{content}', 'App\Http\Controllers\ContentController@deleteSubmit')->name('content.delete.submit');
