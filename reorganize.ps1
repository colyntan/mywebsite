# Create directories
New-Item -ItemType Directory -Path "public/css", "public/js", "public/images", "src/components", "src/pages", "src/utils", "docs/architecture" -Force

# Move files
Move-Item -Path "styles.css" -Destination "public/css/" -Force
Move-Item -Path "app.js", "main.js" -Destination "public/js/" -Force
Move-Item -Path "index.html", "receiptproject.html" -Destination "src/pages/" -Force
Move-Item -Path "ewewew.md", "finance_app.md" -Destination "docs/" -Force
Move-Item -Path "WebsiteArchitecture/notes.txt" -Destination "docs/architecture/" -Force

# Remove empty directories
Remove-Item -Path "WebsiteArchitecture" -Recurse -Force -ErrorAction SilentlyContinue

# Update file references
(Get-Content "src/pages/index.html") -replace 'href="styles.css"', 'href="/public/css/styles.css"' | Set-Content "src/pages/index.html"
(Get-Content "src/pages/index.html") -replace 'src="main.js"', 'src="/public/js/main.js"' | Set-Content "src/pages/index.html"
(Get-Content "src/pages/receiptproject.html") -replace 'href="styles.css"', 'href="/public/css/styles.css"' | Set-Content "src/pages/receiptproject.html"
(Get-Content "src/pages/receiptproject.html") -replace 'src="app.js"', 'src="/public/js/app.js"' | Set-Content "src/pages/receiptproject.html"

Write-Host "Reorganization complete! Your project structure has been updated."