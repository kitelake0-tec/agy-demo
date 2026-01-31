import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sensors_plus/sensors_plus.dart';

// 1. Define State
enum CameraStateStatus { idle, stabilizing, scanning, processing }

class ScannerState {
  final CameraStateStatus status;
  final bool isStable;
  final double stabilityScore; // 0.0 to 1.0 (1.0 = super stable)

  ScannerState({
    required this.status,
    required this.isStable,
    required this.stabilityScore,
  });

  ScannerState copyWith({
    CameraStateStatus? status,
    bool? isStable,
    double? stabilityScore,
  }) {
    return ScannerState(
      status: status ?? this.status,
      isStable: isStable ?? this.isStable,
      stabilityScore: stabilityScore ?? this.stabilityScore,
    );
  }
}

// 2. Define Controller
class ScannerController extends StateNotifier<ScannerState> {
  ScannerController()
      : super(ScannerState(
          status: CameraStateStatus.idle,
          isStable: false,
          stabilityScore: 0.0,
        )) {
    _initSensors();
  }

  StreamSubscription? _accelSubscription;
  Timer? _stabilityTimer;
  List<double> _recentAccelerations = [];
  
  void _initSensors() {
    // Listen to accelerometer events
    _accelSubscription = accelerometerEvents.listen((event) {
      final totalAccel = event.x.abs() + event.y.abs() + event.z.abs();
      // Gravity is ~9.8. Deviation from ~9.8 indicates movement.
      // Or just check variance of recent samples.
      
      _addSample(totalAccel);
    });
  }

  void _addSample(double value) {
    _recentAccelerations.add(value);
    if (_recentAccelerations.length > 10) {
      _recentAccelerations.removeAt(0);
    }
    
    _checkStability();
  }

  void _checkStability() {
    if (_recentAccelerations.length < 5) return;

    // Calculate Variance
    double mean = _recentAccelerations.reduce((a, b) => a + b) / _recentAccelerations.length;
    double variance = _recentAccelerations.map((v) => (v - mean) * (v - mean)).reduce((a, b) => a + b) / _recentAccelerations.length;

    // Determine Stability
    // If variance is low, device is stable.
    bool isStableCurrently = variance < 0.2; 
    
    if (isStableCurrently && state.status == CameraStateStatus.idle) {
      if (_stabilityTimer == null || !_stabilityTimer!.isActive) {
        // Start counting for auto-capture
        _stabilityTimer = Timer(const Duration(milliseconds: 1500), () {
          _triggerAutoCapture();
        });
        state = state.copyWith(isStable: true, status: CameraStateStatus.stabilizing);
      }
    } else if (!isStableCurrently) {
      _stabilityTimer?.cancel();
      state = state.copyWith(isStable: false, status: CameraStateStatus.idle);
    }
  }

  Future<void> _triggerAutoCapture() async {
    if (state.status != CameraStateStatus.stabilizing) return;
    
    state = state.copyWith(status: CameraStateStatus.scanning);
    
    // Notify UI to Capture (This will be listened to by the setup in UI)
    // For now, we just reset after a delay to simulate action
    await Future.delayed(const Duration(milliseconds: 200)); 
    // Actual capture logic is handled by the View usually calling a method here or vice versa.
    // Here we assume the UI observes the 'scanning' state and triggers the camera plugin.
  }

  void setProcessing() {
    state = state.copyWith(status: CameraStateStatus.processing);
  }

  void reset() {
    state = state.copyWith(status: CameraStateStatus.idle);
  }

  @override
  void dispose() {
    _accelSubscription?.cancel();
    _stabilityTimer?.cancel();
    super.dispose();
  }
}

final scannerProvider = StateNotifierProvider<ScannerController, ScannerState>((ref) {
  return ScannerController();
});
