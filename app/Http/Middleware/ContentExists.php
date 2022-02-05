<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Content;

class ContentExists {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next) {
        $id = $request->route('id');
        $content = Content::find($id);

        // Check if content exists, otherwise return HTTP 404.
        if (!$content) {
            abort(404);
        }
        else {
            $request->attributes->add(['ObjContent' => $content]);
        }

        return $next($request);
    }
}
