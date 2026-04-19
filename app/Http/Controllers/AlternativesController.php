<?php

namespace App\Http\Controllers;

use App\Services\FeatureFlagService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlternativesController extends Controller
{
    public function index(Request $request, FeatureFlagService $flags): Response
    {
        abort_unless($flags->active('alternatives-page', $request->user()), 404);

        return Inertia::render('AlternativesPage');
    }
}
