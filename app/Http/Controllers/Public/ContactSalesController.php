<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactSalesRequest;
use App\Models\SalesLead;
use Illuminate\Http\JsonResponse;

class ContactSalesController extends Controller
{
    public function __invoke(ContactSalesRequest $request): JsonResponse
    {
        $data = $request->validated();

        $lead = SalesLead::create([
            'name' => $data['name'],
            'work_email' => $data['work_email'],
            'company' => $data['company'],
            'monthly_volume' => $data['monthly_volume'] ?? null,
            'message' => $data['message'] ?? null,
            'consented' => true,
            'source' => 'contact-sales',
            // Store a hash, not the address itself — abuse handling does not need PII.
            'ip_hash' => hash('sha256', (string) $request->ip()),
        ]);

        logger()->info('Sales lead captured', ['lead_id' => $lead->id, 'company' => $lead->company]);

        return response()->json([
            'data' => ['message' => 'Thanks — the team will get back to you shortly.'],
        ], 201);
    }
}
