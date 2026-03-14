param(
    [string]$EcsHost = "47.115.72.187",
    [int]$Port = 22,
    [string]$User = "root",
    [string]$IdentityFile = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployScript = Join-Path $repoRoot "scripts\deploy-ecs.sh"

if (-not (Test-Path -LiteralPath $deployScript)) {
    throw "Missing deploy script: $deployScript"
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("qq-page-deploy-" + [guid]::NewGuid().ToString("N"))
$stageDir = Join-Path $tempRoot "stage"
$artifactPath = Join-Path $tempRoot "qq-page-release.tar.gz"
$releaseId = Get-Date -Format "yyyyMMddHHmmss"
$remoteArtifact = "/tmp/qq-page-release-$releaseId.tar.gz"
$remoteScript = "/tmp/deploy-ecs-$releaseId.sh"
$sshTarget = "$User@$EcsHost"

New-Item -ItemType Directory -Force -Path $stageDir | Out-Null

try {
    $files = git -C $repoRoot ls-files --cached --others --exclude-standard
    if ($LASTEXITCODE -ne 0) {
        throw "git ls-files failed"
    }

    foreach ($relativePath in $files) {
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            continue
        }

        $sourcePath = Join-Path $repoRoot $relativePath
        if (-not (Test-Path -LiteralPath $sourcePath)) {
            continue
        }

        $destinationPath = Join-Path $stageDir $relativePath
        $destinationDir = Split-Path -Parent $destinationPath
        if ($destinationDir) {
            New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
        }

        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
    }

    & tar -czf $artifactPath -C $stageDir .
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create release archive"
    }

    $sshArgs = @("-p", $Port.ToString())
    $scpArgs = @("-P", $Port.ToString())
    if ($IdentityFile) {
        $sshArgs += @("-i", $IdentityFile)
        $scpArgs += @("-i", $IdentityFile)
    }

    & scp @scpArgs $artifactPath "${sshTarget}:${remoteArtifact}"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload release artifact"
    }

    & scp @scpArgs $deployScript "${sshTarget}:${remoteScript}"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload deploy script"
    }

    & ssh @sshArgs $sshTarget "chmod +x '$remoteScript' && RELEASE_ID='$releaseId' '$remoteScript' '$remoteArtifact'"
    if ($LASTEXITCODE -ne 0) {
        throw "Remote deployment failed"
    }
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }

    $cleanupArgs = @("-p", $Port.ToString())
    if ($IdentityFile) {
        $cleanupArgs += @("-i", $IdentityFile)
    }

    & ssh @cleanupArgs $sshTarget "rm -f '$remoteArtifact' '$remoteScript'" | Out-Null
}
