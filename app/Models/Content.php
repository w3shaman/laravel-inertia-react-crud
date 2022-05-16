<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Content extends Model {
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'content';

    /**
     * Function for filtering content by keyword in its title and body.
     */
    public function searchByKeyword($keyword) {
        // Explode into words.
        $arr_keywords = explode(' ', $keyword);

        // Title od body must contain whole words.
        $content = $this->where(function (Builder $query) use ($arr_keywords){
            foreach ($arr_keywords as $word) {
                $query = $query->where('title', 'LIKE', '%' . $word. '%');
            }
        })
        ->orWhere(function (Builder $query) use ($arr_keywords){
            foreach ($arr_keywords as $word) {
                $query = $query->where('body', 'LIKE', '%' . $word. '%');
            }
        });

        return $content;
    }
}
