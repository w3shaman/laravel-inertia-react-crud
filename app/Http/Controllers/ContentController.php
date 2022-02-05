<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Database\Eloquent\Builder;

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

        if ($keyword !== NULL && $keyword !== '') {
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

    public function add(Request $request) {
        return $this->formHandler($request);
    }

    public function edit(Request $request, $id) {
        return $this->formHandler($request, $id);
    }

    public function delete(Request $request, $id) {
        // Load content object from middleware.
        $content = $request->get('ObjContent');

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

    private function formHandler(Request $request, $id = NULL) {
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

            if ($id == NULL) {
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

                return redirect(route('content.add'))->with(['success' => 'New content has been added.']);
            }
            else {
                // Load content object from middleware.
                $content = $request->get('ObjContent');

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

                return redirect(route('content.index'))->with(['success' => 'Content has been updated.']);
            }
        }

        if ($id === NULL) {
            return Inertia::render('Content/Edit');
        }
        else {
            $content = Content::find($id);

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
