<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
function failImport(int $status, string $message): never { http_response_code($status); echo json_encode(['ok'=>false,'message'=>$message]); exit; }
if (!($_SESSION['is_logged_in'] ?? false)) failImport(401, 'Sesi login diperlukan.');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') failImport(405, 'Metode tidak diizinkan.');
if (!isset($_FILES['access_file'])) failImport(422, 'Pilih file Microsoft Access.');
$file = $_FILES['access_file'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) failImport(422, 'Upload gagal. Batas file server harus minimal 300 MB.');
$extension = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ['accdb','mdb'], true)) failImport(422, 'Format harus ACCDB atau MDB.');
if ((int)$file['size'] > 300 * 1024 * 1024) failImport(413, 'Ukuran file melebihi 300 MB.');
$token = bin2hex(random_bytes(12)); $databasePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $token . '.' . $extension;
$outputPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $token . '.json';
if (!move_uploaded_file($file['tmp_name'], $databasePath)) failImport(500, 'File upload tidak dapat diproses.');
if (PHP_OS_FAMILY === 'Windows') {
    $powershell = getenv('WINDIR') . '\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe';
    $script = dirname(__DIR__) . '\\scripts\\read-access.ps1';
    $command = [$powershell,'-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',$script,'-DatabasePath',$databasePath,'-OutputPath',$outputPath];
    $pipes=[]; $process=proc_open($command,[1=>['pipe','w'],2=>['pipe','w']],$pipes);
    if (!is_resource($process)) { @unlink($databasePath); failImport(500, 'Pembaca Microsoft Access tidak dapat dijalankan.'); }
    $stdout=stream_get_contents($pipes[1]); $stderr=stream_get_contents($pipes[2]); fclose($pipes[1]); fclose($pipes[2]); $exitCode=proc_close($process);
    @unlink($databasePath);
    if ($exitCode !== 0 || !is_file($outputPath)) { error_log($stdout . $stderr); @unlink($outputPath); failImport(500, 'Database Access gagal dibaca. Pastikan file tidak rusak atau diproteksi sandi.'); }
    $json=file_get_contents($outputPath); @unlink($outputPath); $payload=json_decode((string)$json,true);
} else {
    $mdbTables = trim((string) shell_exec('command -v mdb-tables 2>/dev/null'));
    $mdbExport = trim((string) shell_exec('command -v mdb-export 2>/dev/null'));
    if ($mdbTables === '' || $mdbExport === '') { @unlink($databasePath); failImport(501, 'Server aaPanel memerlukan mdbtools. Jalankan: apt install mdbtools'); }
    $run = static function(array $command): array {
        $pipes=[]; $process=proc_open($command,[1=>['pipe','w'],2=>['pipe','w']],$pipes);
        if (!is_resource($process)) return ['', 'process error', 1];
        $out=stream_get_contents($pipes[1]); $err=stream_get_contents($pipes[2]); fclose($pipes[1]); fclose($pipes[2]);
        return [$out,$err,proc_close($process)];
    };
    [$tableOutput,$tableError,$tableExit]=$run([$mdbTables,'-1',$databasePath]);
    if ($tableExit !== 0) { @unlink($databasePath); error_log($tableError); failImport(500, 'Database Access gagal dibaca oleh mdbtools.'); }
    $tables=[];
    foreach (array_filter(array_map('trim', preg_split('/\R/', $tableOutput))) as $tableName) {
        [$csv,$csvError,$csvExit]=$run([$mdbExport,'-b','strip',$databasePath,$tableName]);
        if ($csvExit !== 0 || trim($csv) === '') continue;
        $handle=fopen('php://temp','r+'); fwrite($handle,$csv); rewind($handle); $headers=fgetcsv($handle) ?: []; $rows=[];
        while (($values=fgetcsv($handle)) !== false) { $values=array_pad($values,count($headers),''); $rows[]=array_combine($headers,array_slice($values,0,count($headers))); }
        fclose($handle); $tables[]=['name'=>$tableName,'rows'=>$rows];
    }
    @unlink($databasePath); $payload=['tables'=>$tables,'tableCount'=>count($tables)];
}
if (!is_array($payload)) failImport(500, 'Hasil pembacaan Access tidak valid.');
$payload['ok']=true; echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
