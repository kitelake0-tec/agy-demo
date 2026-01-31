import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ai_book_scanner/features/camera/screens/smart_camera_view.dart';
import 'package:ai_book_scanner/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // ToDo: Initialize Isar/Local DB here if needed
  
  runApp(const ProviderScope(child: AiBookScannerApp()));
}

class AiBookScannerApp extends StatelessWidget {
  const AiBookScannerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Book Scanner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme, // Default to dark for camera apps
      home: const SmartCameraView(),
    );
  }
}
