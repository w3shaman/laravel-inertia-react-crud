<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Database\Eloquent\Builder;

// Load the Model.
use App\Models\Content;

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
            Cookie::queue('keyword', $keyword, 1440);
        }

        if ($keyword !== NULL) {
            // Explode into words.
            $arr_keywords = explode(' ', $keyword);

            // Title must contain whole words.
            $content = $content->orWhere(function (Builder $query) use ($arr_keywords){
                foreach ($arr_keywords as $word) {
                    $query = $query->where('title', 'LIKE', '%' . $word. '%');
                }
            });

            // Body must contain whole words.
            $content = $content->orWhere(function (Builder $query) use ($arr_keywords){
                foreach ($arr_keywords as $word) {
                    $query = $query->where('body', 'LIKE', '%' . $word. '%');
                }
            });
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
    public function add(Request $request) {
        return $this->formHandler($request);
    }

    /**
     * Show form for editting existing content.
     * The Content Model is automatically injected from routes/web.php.
     */
    public function edit(Request $request, Content $content) {
        return $this->formHandler($request, $content);
    }

    /**
     * Show confirmation page for deleting existing content.
     * The Content Model is automatically injected from routes/web.php.
     */
    public function delete(Request $request, Content $content) {
        if ($request->input('submit')) {
            // Delete the image first.
            if (Storage::disk('public')->exists($content->image)) {
                Storage::disk('public')->delete($content->image);
            }

            $content->delete();

            return redirect(route('content.index'))->with(['success' => 'Content has been deleted.']);
        }

        return Inertia::render('Content/Delete',[
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
            ],
        ]);
    }

    /**
     * Form handler for displaying and handle saving for adding/editting content.
     * The Content Model is NULL on add mode and automatically injected from routes/web.php
     * on edit mode.
     */
    private function formHandler(Request $request, Content $content = NULL) {
        // Check if there is submitted data.
        if ($request->input('submit')) {
            $request->validate([
                'title' => 'required',
                'body' => 'required',
                'publish' => 'in:Y,N',
                'publish_date' => 'date',
                'image' => 'nullable|mimes:jpeg,png',
            ]);

            // Check uploaded image.
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $ext = $image->extension();
            }

            // NULL Content Model is assumed as add mode.
            if ($content == NULL) {
                // So we need to create new instance.
                $content = new Content();

                $content->title = $request->input('title');
                $content->body = $request->input('body');
                $content->publish = $request->input('publish');
                $content->publish_date = $request->input('publish_date');

                $content->save();

                // Store uploaded image.
                if (isset($image)) {
                    $image_file = $image->storeAs('content/' . $content->created_at->format('Y/m'), 'img_' . $content->id . '.' . $ext, 'public');

                    $content->image = $image_file;
                    $content->save();
                }

                // Define the success message.
                $message = ['success' => 'New content has been added.'];
            }
            else {
                // Update the injected Content Model object.
                $content->title = $request->input('title');
                $content->body = $request->input('body');
                $content->publish = $request->input('publish');
                $content->publish_date = $request->input('publish_date');

                if (isset($image) || $request->input('remove_image')) {
                    // Delete existing image first.
                    if (Storage::disk('public')->exists($content->image)) {
                        Storage::disk('public')->delete($content->image);

                        $content->image = NULL;
                    }

                    // Re-upload image if uploaded.
                    if (isset($image)) {
                        $image_file = $image->storeAs('content/' . $content->created_at->format('Y/m'), 'img_' . $content->id . '.' . $ext, 'public');

                        $content->image = $image_file;
                    }
                }

                $content->save();

                // Define the success message.
                $message = ['success' => 'Content has been updated.'];
            }

            // Decide where the next URL will be. Back to index on stay in current form.
            if ($request->input('save_mode') == 'save') {
                $next_url = route('content.index');
            }
            else {
                $next_url = url()->full();
            }

            return redirect($next_url)->with($message);
        }

        // On add mode, we show empty form.
        if ($content === NULL) {
            return Inertia::render('Content/Edit');
        }
        else {
            // Otherwise, initialize the value for each field.
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
    }
}
