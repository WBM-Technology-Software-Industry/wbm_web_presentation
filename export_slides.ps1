try {
    $ppt = New-Object -ComObject PowerPoint.Application
    Write-Host "PowerPoint COM available!"
    $presentation = $ppt.Presentations.Open((Resolve-Path "Apresentação WBM Technology NOXON GEROLIN.pptx").Path, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    $outputDir = (Resolve-Path ".").Path + "\slide_images"
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    $i = 1
    foreach ($slide in $presentation.Slides) {
        $slide.Export("$outputDir\slide_$i.png", "PNG", 1920, 1080)
        $i++
    }
    Write-Host "Slides exported successfully to $outputDir"
    $presentation.Close()
    $ppt.Quit()
} catch {
    Write-Host "COM Error:" $_.Exception.Message
}
