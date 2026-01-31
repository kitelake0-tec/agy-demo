import 'package:camerawesome/camerawesome_plugin.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ai_book_scanner/features/camera/controllers/camera_controller.dart';
import 'package:ai_book_scanner/features/scanner/logic/image_processor.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class SmartCameraView extends ConsumerStatefulWidget {
  const SmartCameraView({super.key});

  @override
  ConsumerState<SmartCameraView> createState() => _SmartCameraViewState();
}

class _SmartCameraViewState extends ConsumerState<SmartCameraView> {
  // To keep track if we already triggered capture for the current stable session
  bool _hasTriggeredCapture = false;

  @override
  Widget build(BuildContext context) {
    final scannerState = ref.watch(scannerProvider);

    return Scaffold(
      body: Stack(
        children: [
          // 1. Camera Layer
          Positioned.fill(
            child: CameraAwesomeBuilder.custom(
              saveConfig: SaveConfig.photo(pathBuilder: _pathBuilder),
              builder: (cameraState, previewSize, previewRect) {
                // Return your UI on top of the preview
                // We use this builder to access 'cameraState' for taking photos
                _handleAutoScan(cameraState, scannerState);
                
                return const SizedBox.shrink(); // We draw overlays in the Stack above
              },
            ),
          ),
          
          // 2. Overlay Layer (Grid, Glow, Instruction)
          Positioned.fill(
            child: IgnorePointer(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                decoration: BoxDecoration(
                  border: Border.all(
                    color: scannerState.status == CameraStateStatus.stabilizing
                        ? Colors.greenAccent.withOpacity(0.8) // Glow when stable
                        : Colors.transparent,
                    width: 8,
                  ),
                  boxShadow: scannerState.status == CameraStateStatus.stabilizing
                      ? [
                          BoxShadow(
                            color: Colors.greenAccent.withOpacity(0.5),
                            blurRadius: 20,
                            spreadRadius: 5,
                          )
                        ]
                      : [],
                ),
              ),
            ),
          ),

          // 3. Status Text
          Positioned(
            bottom: 100,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _getStatusText(scannerState.status),
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ),
          ),
          
          // 4. Manual Shutter Button (Optional)
          Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Center(
              child: FloatingActionButton(
                backgroundColor: Colors.white,
                onPressed: () {
                  // Todo: Implement manual capture trigger
                },
                child: const Icon(Icons.camera, color: Colors.black),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getStatusText(CameraStateStatus status) {
    switch (status) {
      case CameraStateStatus.idle:
        return "종이가 보이게 멈춰주세요";
      case CameraStateStatus.stabilizing:
        return "스캔형태 유지 중...";
      case CameraStateStatus.scanning:
        return "촬영!";
      case CameraStateStatus.processing:
        return "처리 중...";
    }
  }

  void _handleAutoScan(CameraState cameraState, ScannerState scannerState) {
    // If controller says 'scanning' and we haven't fired yet
    if (scannerState.status == CameraStateStatus.scanning && !_hasTriggeredCapture) {
      _hasTriggeredCapture = true;
      _takePhoto(cameraState);
    } 
    // Reset flag if we go back to idle
    else if (scannerState.status == CameraStateStatus.idle) {
      _hasTriggeredCapture = false;
    }
  }

  Future<void> _takePhoto(CameraState cameraState) async {
    HapticFeedback.mediumImpact();
    // Play sound if needed
    
    if (cameraState is PhotoCameraState) {
       // Capture
       final captureRequest = await cameraState.takePhoto();
       final path = captureRequest.when(
         single: (single) => single.file?.path,
         multiple: (multiple) => multiple.file?.path, // Handle logic needed
       );

       if (path != null) {
         _onPhotoTaken(path);
       }
    }
    
    // Reset controller
    ref.read(scannerProvider.notifier).reset();
  }

  Future<String> _pathBuilder(List<Sensor> sensors) async {
    final extDir = await getTemporaryDirectory();
    final testDir = await Directory('${extDir.path}/camerawesome').create(recursive: true);
    final String filePath = '${testDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg';
    return filePath;
  }

  Future<void> _onPhotoTaken(String path) async {
    // Navigate to preview or start background processing
    print("Photo saved to $path");
    
    // Example: Trigger background processing
    final bytes = await File(path).readAsBytes();
    
    // This should ideally be moved to a repository/service
    // Just demonstrating the connection here
    // final points = await ImageProcessor.detectDocument(bytes);
    // final processed = await ImageProcessor.processDocument(bytes, points);
  }
}
