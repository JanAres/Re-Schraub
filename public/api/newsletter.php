<?php
declare(strict_types=1);



header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

$allowedOrigins = [
    'https://re-schraub.eu',
    'https://www.re-schraub.eu',
    'http://localhost:3000',
    'http://localhost:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['error' => 'Method not allowed.']);
}

$configPath = __DIR__ . '/rapidmail-config.php';
if (!is_file($configPath)) {
    json_response(500, ['error' => 'Newsletter-Konfiguration fehlt.']);
}

$config = require $configPath;

$rawBody = file_get_contents('php://input');
if ($rawBody === false || trim($rawBody) === '') {
    json_response(400, ['error' => 'Leere Anfrage.']);
}

$input = json_decode($rawBody, true);
if (!is_array($input)) {
    json_response(400, ['error' => 'Ungültiges JSON.']);
}

$contact = $input['contact'] ?? [];
$consent = $input['consent'] ?? [];

$email = strtolower(trim((string)($contact['emailAddress'] ?? '')));
$firstName = trim((string)($contact['firstName'] ?? ''));
$lastName = trim((string)($contact['lastName'] ?? ''));
$fullName = trim((string)($contact['fullName'] ?? ''));
$salutation = trim((string)($contact['salutation'] ?? ''));
$company = trim((string)($contact['companyName'] ?? ''));
$phone = trim((string)($contact['phoneNumber'] ?? ''));
$activeUntil = trim((string)($contact['newsletterActiveUntil'] ?? ''));
$activeUntilDate = $contact['newsletterActiveUntilDate'] ?? null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(400, ['error' => 'Bitte eine gültige E-Mail-Adresse eingeben.']);
}

if (empty($consent['accepted'])) {
    json_response(400, ['error' => 'Bitte Newsletter-Einwilligung bestätigen.']);
}

if ($fullName === '' && ($firstName !== '' || $lastName !== '')) {
    $fullName = trim($firstName . ' ' . $lastName);
}

$apiUser = (string)($config['rapidmail_api_user'] ?? '');
$apiPassword = (string)($config['rapidmail_api_password'] ?? '');
$listId = (string)($config['rapidmail_recipientlist_id'] ?? '');

if ($apiUser === '' || $apiPassword === '' || $listId === '') {
    json_response(500, ['error' => 'rapidmail Zugangsdaten sind nicht vollständig konfiguriert.']);
}

$endpoint = 'https://apiv3.emailsys.net/v1/recipients?send_activationmail=yes';

$recipientPayload = [
    'recipientlist_id' => (int)$listId,
    'email' => $email,
];

if ($firstName !== '') {
    $recipientPayload['firstname'] = $firstName;
}

if ($lastName !== '') {
    $recipientPayload['lastname'] = $lastName;
}

$gender = map_salutation_to_gender($salutation);
if ($gender !== '') {
    $recipientPayload['gender'] = $gender;
}



error_log('rapidmail endpoint: ' . $endpoint);
error_log('rapidmail payload: ' . json_encode($recipientPayload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
error_log('rapidmail api user set: ' . ($apiUser !== '' ? 'yes' : 'no'));
error_log('rapidmail api pass set: ' . ($apiPassword !== '' ? 'yes' : 'no'));



$response = http_post_json_basic_auth($endpoint, $recipientPayload, $apiUser, $apiPassword);
$status = $response['status'];
$body = $response['body'];
$error = $response['error'];

if ($error !== '') {
    error_log('rapidmail curl error: ' . $error);
    json_response(502, ['error' => 'Serverfehler bei der Newsletter-Anmeldung.']);
}

$decoded = json_decode($body, true);
if ($status >= 200 && $status < 300) {
    json_response(200, [
        'success' => true,
        'message' => 'Fast geschafft: Bitte bestätige deine Anmeldung über die E-Mail von rapidmail.',
    ]);
}

error_log('rapidmail response status ' . $status . ': ' . $body);

if ($status === 409) {
    json_response(200, [
        'success' => true,
        'message' => 'Diese E-Mail-Adresse ist bereits eingetragen oder wartet auf Bestätigung.',
    ]);
}

$rapidmailMessage = '';
if (is_array($decoded)) {
    $rapidmailMessage = (string)($decoded['message'] ?? $decoded['error'] ?? $decoded['title'] ?? '');
}

json_response(502, [
    'error' => $rapidmailMessage !== ''
        ? 'rapidmail konnte die Anmeldung nicht abschließen: ' . $rapidmailMessage
        : 'rapidmail konnte die Anmeldung nicht abschließen.',
]);

function http_post_json_basic_auth(string $url, array $payload, string $user, string $password): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_USERPWD => $user . ':' . $password,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
    ]);

    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [
        'status' => $status,
        'body' => is_string($body) ? $body : '',
        'error' => $error,
    ];
}

function map_salutation_to_gender(string $salutation): string
{
    $normalized = mb_strtolower(trim($salutation), 'UTF-8');
    if ($normalized === 'herr') {
        return 'male';
    }
    if ($normalized === 'frau') {
        return 'female';
    }
    return '';
}

function json_response(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
