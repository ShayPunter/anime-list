<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListEntryRequest;
use App\Http\Requests\UpdateListEntryRequest;
use App\Http\Resources\ListEntryResource;
use App\Models\UserAnimeList;
use App\Services\MalExportService;
use App\Services\UserListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserListController extends Controller
{
    public function __construct(
        private readonly UserListService $listService,
    ) {}

    public function index(Request $request): Response
    {
        $data = $this->listService->getListForPage($request->user());

        return Inertia::render('MyListPage', $data);
    }

    public function store(StoreListEntryRequest $request): JsonResponse
    {
        $entry = $this->listService->store($request->user(), $request->validated());
        $entry->load('anime.genres');

        return response()->json(
            new ListEntryResource($entry),
            201,
        );
    }

    public function update(UpdateListEntryRequest $request, UserAnimeList $entry): JsonResponse
    {
        $entry = $this->listService->update($entry, $request->validated());
        $entry->load('anime.genres');

        return response()->json(new ListEntryResource($entry));
    }

    public function destroy(Request $request, UserAnimeList $entry): JsonResponse
    {
        abort_if($entry->user_id !== $request->user()->id, 403);

        $this->listService->delete($entry);

        return response()->json(null, 204);
    }

    public function export(Request $request, MalExportService $exportService): StreamedResponse
    {
        $xml = $exportService->generate($request->user());

        return response()->streamDownload(function () use ($xml) {
            echo $xml;
        }, 'animelist_export.xml', [
            'Content-Type' => 'application/xml',
        ]);
    }
}
