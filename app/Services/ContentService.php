<?php

namespace App\Services;

use App\Models\Content;
use Illuminate\Support\Facades\Storage;

class ContentService {
    /**
     * The content model object.
     */
    protected $content;

    /**
     * Construct new content service.
     */
    public function __construct(Content $content) {
        $this->content = $content;
    }

    /**
     * Re-load the content by id. Required by update and delete method.
     */
    protected function loadContent($id) {
        $this->content = $this->content->find($id);
    }

    /**
     * Method for searching content.
     */
    public function search($keyword = NULL) {
        // Return the content list.
        return $this->content->searchByKeyword($keyword)
                        ->orderBy('id', 'desc')
                        ->paginate(config('vars.pagination.items_per_page'));
    }

    /**
     * Method for adding new content.
     */
    public function add($title, $body, $image, $publish, $publish_date) {
        // Store the main fields first.
        $this->content->title = $title;
        $this->content->body = $body;
        $this->content->publish = $publish;
        $this->content->publish_date = $publish_date;

        $this->content->save();

        // Store uploaded image later because we need the content id.
        if (is_object($image)) {
            $image_file = $image->storeAs(
                    'content/' . $this->content->created_at->format('Y/m'),
                    'img_' . $this->content->id . '.' . $image->extension(),
                    'public'
                );

            $this->content->image = $image_file;
            $this->content->save();
        }

        // Return the newly added content.
        return $this->content;
    }

    /**
     * Method for updating content.
     */
    public function update($id, $title, $body, $image, $publish, $publish_date, $remove_image = NULL) {
        // Load the content by id.
        $this->loadContent($id);

        // Update the main fields first.
        $this->content->title = $title;
        $this->content->body = $body;
        $this->content->publish = $publish;
        $this->content->publish_date = $publish_date;

        // Check if we should update the image.
        if (is_object($image) || $remove_image !== NULL) {
            // Delete existing image first.
            if (Storage::disk('public')->exists($this->content->image)) {
                Storage::disk('public')->delete($this->content->image);

                $this->content->image = NULL;
            }

            // Re-upload image if uploaded.
            if (is_object($image)) {
                $image_file = $image->storeAs(
                        'content/' . $this->content->created_at->format('Y/m'),
                        'img_' . $this->content->id . '.' . $image->extension(),
                        'public'
                    );

                $this->content->image = $image_file;
            }
        }

        $this->content->save();

        // Return the updated content.
        return $this->content;
    }

    /**
     * Method for deleting content.
     */
    public function delete($id) {
        // Load the content by id.
        $this->loadContent($id);

        // Delete the image first.
        if (Storage::disk('public')->exists($this->content->image)) {
            Storage::disk('public')->delete($this->content->image);
        }

        // Delete the content
        $this->content->delete();

        // Return deleted content id.
        return $id;
    }
}
