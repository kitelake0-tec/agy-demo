import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: const Color(0xFF00E676), // Bright Green for Scanner Vibe
    scaffoldBackgroundColor: Colors.black,
    useMaterial3: true,
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF00E676),
      secondary: Color(0xFF2979FF),
      surface: Color(0xFF1E1E1E),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
    ),
  );
}
