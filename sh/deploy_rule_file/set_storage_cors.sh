bucket=

gsutil cors set rules/storage_cors.json $bucket
gsutil cors get $bucket