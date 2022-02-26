<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContentRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        // Validation rules applied for handling add or update content.
        // By using this we don't need to write the rules twice.
        return [
            'title' => 'required',
            'body' => 'required',
            'publish' => 'in:Y,N',
            'publish_date' => 'date',
            'image' => 'nullable|mimes:jpeg,png',
        ];
    }
}
