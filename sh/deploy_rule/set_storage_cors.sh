bucket=

gsutil cors set rules/cors.json $bucket
gsutil cors get $bucket