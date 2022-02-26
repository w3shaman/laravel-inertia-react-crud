<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cookie;

// Load the Model.
use App\Models\Content;

// Custom form request validation for handling add or update content.
use App\Http\Requests\ContentRequest;

class ContentController extends Controller {
    /**
     * Show content list.
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request) {
        $content = new Content();

        $keyword = $request->cookie('keyword');
        if ($request->input('search')) {
            $keyword = $request->input('keyword');

            // Set cookie to expired if keyword is empty
            $keyword == NULL
                ? Cookie::expire('keyword')
                : Cookie::queue('keyword', $keyword, 1440);
        }

        if ($keyword !== NULL) {
            // Filter content by keyword
            $content = $content->searchByKeyword($keyword);
        }

        $content = $content->orderBy('id', 'desc');
        $content = $content->paginate(config('vars.pagination.items_per_page'));

        return Inertia::render('Content/Index',[
            'contents' => $content,
            'keyword' => $keyword,
        ]);
    }

    /**
     * Show form for add new content.
     */
    public function add() {
        return Inertia::render('Content/Edit');
    }

    /**
     * Handle new content submission.
     */
    public function addSubmit(ContentRequest $request) {
        $content = new Content();

        $content->title = $request->input('title');
        $content->body = $request->input('body');
        $content->publish = $request->input('publish');
        $content->publish_date = $request->input('publish_date');

        $content->save();

        // Store uploaded image.
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image_file = $image->storeAs('content/' . $content->created_at->format('Y/m'), 'img_' . $content->id . '.' . $image->extension(), 'public');

            $content->image = $image_file;
            $content->save();
        }

        // Decide where the next URL will be. Back to index on stay in current form.
        if ($request->input('save_mode') == 'save') {
            $next_url = route('content.index');
        }
        else {
            $next_url = url()->full();
        }

        return redirect($next_url)->with(['success' => 'New content has been added.']);
    }

    /**
     * Show form for editting existing content.
     * The Content Model is automatically injected from routes/web.php.
     */
    public function edit(Request $request, Content $content) {
        return Inertia::render('Content/Edit',[
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
                'body' => $content->body,
                'image' => $content->image === NULL ? '' : Storage::url($content->image),
                'publish' => $content->publish,
                'publish_date' => $content->publish_date,
            ],
        ]);
    }

    /**
     * Handle new content submission.
     */
    public function editSubmit(ContentRequest $request, Content $content) {
        // Update the injected Content Model object.
        $content->title = $request->input('title');
        $content->body = $request->input('body');
        $content->publish = $request->input('publish');
        $content->publish_date = $request->input('publish_date');

        // Check if we should update the image.
        if ($request->hasFile('image') || $request->input('remove_image')) {
            // Delete existing image first.
            if (Storage::disk('public')->exists($content->image)) {
                Storage::disk('public')->delete($content->image);

                $content->image = NULL;
            }

            // Re-upload image if uploaded.
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $image_file = $image->storeAs('content/' . $content->created_at->format('Y/m'), 'img_' . $content->id . '.' . $image->extension(), 'public');

                $content->image = $image_file;
            }
        }

        $content->save();

        // Decide where the next URL will be. Back to index on stay in current form.
        if ($request->input('save_mode') == 'save') {
            $next_url = route('content.index');
        }
        else {
            $next_url = url()->full();
        }

        return redirect($next_url)->with(['success' => 'Content has been updated.']);
    }

    /**
     * Show confirmation page for deleting existing content.
     * The Content Model is automatically injected from routes/web.php.
     */
    public function delete(Request $request, Content $content) {
        return Inertia::render('Content/Delete',[
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
            ],
        ]);
    }

    /**
     * Handle content deletion.
     */
    public function deleteSubmit(Request $request, Content $content) {
        // Delete the image first.
        if (Storage::disk('public')->exists($content->image)) {
            Storage::disk('public')->delete($content->image);
        }

        $content->delete();

        return redirect(route('content.index'))->with(['success' => 'Content has been deleted.']);
    }
}
