param([Parameter(Mandatory=$true)][string]$DatabasePath,[Parameter(Mandatory=$true)][string]$OutputPath)
$ErrorActionPreference = 'Stop'
$connection = New-Object System.Data.Odbc.OdbcConnection("Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=$DatabasePath;")
$connection.Open()
$tables = @()
$tableNames = $connection.GetSchema('Tables') | Where-Object { $_.TABLE_TYPE -eq 'TABLE' -and $_.TABLE_NAME -notlike 'MSys*' -and $_.TABLE_NAME -ne 'Name AutoCorrect Save Failures' } | Select-Object -ExpandProperty TABLE_NAME
foreach ($tableName in $tableNames) {
  $safeName = $tableName.Replace(']', ']]')
  $command = $connection.CreateCommand(); $command.CommandText = "SELECT * FROM [$safeName]"
  $reader = $command.ExecuteReader(); $rows = @()
  while ($reader.Read()) {
    $row = [ordered]@{}
    for ($index = 0; $index -lt $reader.FieldCount; $index++) {
      $value = $reader.GetValue($index)
      if ($value -is [System.DBNull]) { $value = $null }
      elseif ($value -is [byte[]]) { $value = '[Data biner]' }
      elseif ($value -is [DateTime]) { $value = $value.ToString('yyyy-MM-dd HH:mm:ss') }
      $row[$reader.GetName($index)] = $value
    }
    $rows += [pscustomobject]$row
  }
  $reader.Close(); $tables += [pscustomobject]@{ name=$tableName; rows=$rows }
}
$connection.Close()
[pscustomobject]@{ tables=$tables; tableCount=$tables.Count } | ConvertTo-Json -Depth 8 -Compress | Set-Content -LiteralPath $OutputPath -Encoding UTF8
