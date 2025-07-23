@echo off
echo Running writer.js and reader.js in parallel...
start cmd /k "npx ts-node src/demo/writer.ts"
start cmd /k "npx ts-node src/demo/reader.ts"