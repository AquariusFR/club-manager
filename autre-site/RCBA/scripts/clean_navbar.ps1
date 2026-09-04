$ErrorActionPreference = "Continue"
$files = Get-ChildItem -Path "c:\CodeIA\projects\RCBA\app" -Recurse -Include "*.tsx" | 
    Where-Object { $_.FullName -notmatch "app\\layout\.tsx" }

$count = 0
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $newContent = $content
        
        # Remove import lines for AuraNavbar (all quote styles)
        $newContent = [regex]::Replace($newContent, "import AuraNavbar from [""']@/components/AuraNavbar[""'];[\r\n]+", "")
        
        # Remove <AuraNavbar session={...} /> usages
        $newContent = [regex]::Replace($newContent, "[ \t]*<AuraNavbar session=\{[^}]*\} />[\r\n]+", "")
        
        if ($newContent -ne $content) {
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Cleaned: $($file.FullName)"
            $count++
        }
    } catch {
        Write-Host "Skipped (error): $($file.FullName) - $_"
    }
}
Write-Host "`nTotal files cleaned: $count"
