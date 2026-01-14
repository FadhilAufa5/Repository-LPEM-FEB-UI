<?php

namespace App\Jobs;

use App\Models\Asset;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessAssetFileUpload implements ShouldQueue
{
    use Queueable;

    public $timeout = 300; // 5 minutes timeout
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $assetId,
        public string $tempFilePath,
        public string $originalFileName,
        public string $mimeType,
        public int $fileSize
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $asset = Asset::findOrFail($this->assetId);

            // Read file from temp storage
            if (Storage::disk('public')->exists($this->tempFilePath)) {
                $fileContent = Storage::disk('public')->get($this->tempFilePath);
                
                // Encode to base64 for database storage
                $base64Content = base64_encode($fileContent);
                
                // Update asset with file data
                $asset->update([
                    'file_content' => $base64Content,
                    'file_name' => $this->originalFileName,
                    'file_mime' => $this->mimeType,
                    'file_size' => $this->fileSize,
                ]);
                
                // Delete temp file after successful storage
                Storage::disk('public')->delete($this->tempFilePath);
                
                Log::info("Asset file uploaded successfully to database", [
                    'asset_id' => $this->assetId,
                    'file_name' => $this->originalFileName,
                    'file_size' => $this->fileSize
                ]);
            } else {
                throw new \Exception("Temp file not found: {$this->tempFilePath}");
            }
        } catch (\Exception $e) {
            Log::error("Failed to process asset file upload", [
                'asset_id' => $this->assetId,
                'error' => $e->getMessage()
            ]);
            
            // Clean up temp file if exists
            if (Storage::disk('public')->exists($this->tempFilePath)) {
                Storage::disk('public')->delete($this->tempFilePath);
            }
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Asset file upload job failed after {$this->tries} attempts", [
            'asset_id' => $this->assetId,
            'error' => $exception->getMessage()
        ]);
        
        // Clean up temp file
        if (Storage::disk('public')->exists($this->tempFilePath)) {
            Storage::disk('public')->delete($this->tempFilePath);
        }
    }
}
