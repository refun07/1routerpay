<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ContactSalesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'work_email' => ['required', 'email:rfc', 'max:180'],
            'company' => ['required', 'string', 'max:160'],
            'monthly_volume' => ['nullable', 'string', 'max:60'],
            'message' => ['nullable', 'string', 'max:2000'],
            'consent' => ['accepted'],

            // Honeypot: must stay empty. Bots fill every field they can see.
            'website' => ['nullable', 'prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'consent.accepted' => 'Please confirm you agree to be contacted about your enquiry.',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        if ($validator->errors()->has('website')) {
            logger()->notice('Contact-sales honeypot triggered', ['ip_hash' => hash('sha256', (string) $this->ip())]);
        }

        throw new ValidationException($validator);
    }
}
