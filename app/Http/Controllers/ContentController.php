<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;

// Load the Model.
use App\Models\Content;

// Custom form request validation for handling add or update content.
use App\Http\Requests\ContentRequest;

// Content service class.
use App\Services\ContentService;

class ContentController extends Controller {
    /**
     * The content service for the detail CRUD process.
     */
    protected $contentService;

    /**
     * The controller constructor.
     */
    public function __construct(ContentService $content_service) {
        $this->contentService = $content_service;
    }

    /**
     * Show content list.
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request) {
        // Check submitted search keyword.
        $keyword =  $request->input('search')
            ? $request->input('keyword')
            : $request->cookie('keyword');

        // Set cookie to expired if keyword is empty.
        $keyword == NULL
            ? Cookie::expire('keyword')
            : Cookie::queue('keyword', $keyword, 1440);

        return Inertia::render('Content/Index',[
            'contents' => $this->contentService->search($keyword), // Return the filtered content list.
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
        // Save the new content using service.
        $this->contentService->add(
                $request->input('title'),
                $request->input('body'),
                $request->file('image'),
                $request->input('publish'),
                $request->input('publish_date')
            );

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
        // Update the content using service.
        $this->contentService->update(
                $content->id,
                $request->input('title'),
                $request->input('body'),
                $request->file('image'),
                $request->input('publish'),
                $request->input('publish_date'),
                $request->input('remove_image')
            );

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
     * Handle content deletion.
     */
    public function delete(Request $request, Content $content) {
        // Update the content using service.
        $this->contentService->delete($content->id);

        return redirect(route('content.index'))->with(['success' => 'Content has been deleted.']);
    }
}
