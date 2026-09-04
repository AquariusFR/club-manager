$ErrorActionPreference = "Continue"
$file = "c:\CodeIA\projects\RCBA\app\direction\performance\page.tsx"

$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix all .map(x => where x has no type annotation (single letter param in template literals)
# Pattern: .map(letter => (not preceded by :)
$newContent = [regex]::Replace($content, '\.map\(([a-zA-Z_$][a-zA-Z0-9_$]*) =>', '.map(($1: any) =>')

if ($newContent -ne $content) {
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed type annotations in performance page"
} else {
    Write-Host "No changes needed"
}
