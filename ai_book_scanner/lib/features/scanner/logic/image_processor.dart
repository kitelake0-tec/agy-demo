import 'dart:async';
import 'dart:math';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:opencv_dart/opencv_dart.dart' as cv;
import 'package:image/image.dart' as img;

/// Core Image Processing Logic
/// All heavy methods are static to be used with [compute].
class ImageProcessor {
  
  /// Detects the document contour and returns the 4 corner points.
  /// Returns empty list if no document found.
  static Future<List<Point<double>>> detectDocument(Uint8List imageBytes) async {
    return compute(_detectDocumentIsolate, imageBytes);
  }

  /// Splits a 2-page spread into two separate images (Left, Right).
  static Future<List<Uint8List>> splitBookSpread(Uint8List imageBytes) async {
    return compute(_splitSpreadIsolate, imageBytes);
  }

  /// Full pipeline: Warp -> Remove Fingers -> Binarize
  static Future<Uint8List> processDocument(Uint8List imageBytes, List<Point<double>> corners) async {
    final data = _ProcessData(imageBytes, corners);
    return compute(_processDocumentIsolate, data);
  }

  // --- Isolate Entry Points ---

  static List<Point<double>> _detectDocumentIsolate(Uint8List bytes) {
    // 1. Decode & Preprocess
    final mat = cv.imdecode(bytes, cv.IMREAD_COLOR);
    final gray = cv.cvtColor(mat, cv.COLOR_BGR2GRAY);
    final blurred = cv.gaussianBlur(gray, (5, 5), 0);
    final edged = cv.canny(blurred, 75, 200);

    // 2. Find Contours
    final (contours, _) = cv.findContours(edged, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    
    // 3. Find largest 4-sided contour
    List<cv.Point> largestContour = [];
    double maxArea = 0;

    for (final contour in contours) {
      final area = cv.contourArea(contour);
      if (area < 1000) continue; // Too small

      final p = cv.arcLength(contour, true);
      final approx = cv.approxPolyDP(contour, 0.02 * p, true);

      if (approx.length == 4 && area > maxArea) {
        largestContour = approx;
        maxArea = area;
      }
    }

    if (largestContour.isEmpty) return [];

    // Convert to Dart Point<double>
    // Note: cv.Point is usually (x, y)
    return largestContour.map((p) => Point(p.x.toDouble(), p.y.toDouble())).toList();
  }

  static Uint8List _processDocumentIsolate(_ProcessData data) {
    final mat = cv.imdecode(data.bytes, cv.IMREAD_COLOR);
    
    // 1. Perspective Warp
    final warped = _fourPointTransform(mat, data.corners);
    
    // 2. Finger Removal (Inpainting)
    final cleaned = _removeFingers(warped);
    
    // 3. Binarization (Adaptive Threshold for "Scanned" look)
    final gray = cv.cvtColor(cleaned, cv.COLOR_BGR2GRAY);
    // adaptiveThreshold parameters: 255 max val, ADAPTIVE_THRESH_GAUSSIAN_C, THRESH_BINARY, blockSize 11, C 2
    final scanned = cv.adaptiveThreshold(gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
    
    // 4. Encode back to jpg/png
    final result = cv.imencode(".jpg", scanned);
    return result;
  }

  static List<Uint8List> _splitSpreadIsolate(Uint8List bytes) {
    var mat = cv.imdecode(bytes, cv.IMREAD_COLOR);
    
    // Rotate if needed (assuming user takes picture in landscape for spread)
    // For this example, we assume the input is already in correct orientation (Landscape)
    // If portrait, we might need to rotate 90 degrees.
    if (mat.rows > mat.cols) {
      mat = cv.rotate(mat, cv.ROTATE_90_CLOCKWISE);
    }

    final width = mat.cols;
    final height = mat.rows;
    final centerX = width ~/ 2;

    // improved center detection could use vertical edge detection near center
    // For now, we use a simple geometric split with a small overlap
    // to account for the binding curvature.
    
    // Left Page
    final leftRect = cv.Rect(0, 0, centerX + 20, height); 
    final leftImg = mat.region(leftRect);
    
    // Right Page
    final rightRect = cv.Rect(centerX - 20, 0, width - (centerX - 20), height);
    final rightImg = mat.region(rightRect);

    // Encode
    final leftBytes = cv.imencode(".jpg", leftImg);
    final rightBytes = cv.imencode(".jpg", rightImg);

    return [leftBytes, rightBytes];
  }

  // --- Helper Logic ---

  static cv.Mat _fourPointTransform(cv.Mat image, List<Point<double>> corners) {
    // Sort corners: top-left, top-right, bottom-right, bottom-left
    final sorted = _orderPoints(corners);
    final (tl, tr, br, bl) = (sorted[0], sorted[1], sorted[2], sorted[3]);

    // Calculate new width & height
    final widthA = sqrt(pow(br.x - bl.x, 2) + pow(br.y - bl.y, 2));
    final widthB = sqrt(pow(tr.x - tl.x, 2) + pow(tr.y - tl.y, 2));
    final maxWidth = max(widthA, widthB).toInt();

    final heightA = sqrt(pow(tr.x - br.x, 2) + pow(tr.y - br.y, 2));
    final heightB = sqrt(pow(tl.x - bl.x, 2) + pow(tl.y - bl.y, 2));
    final maxHeight = max(heightA, heightB).toInt();

    // Destination points
    final dst = cv.Mat.fromList([
      [0, 0],
      [maxWidth - 1, 0],
      [maxWidth - 1, maxHeight - 1],
      [0, maxHeight - 1]
    ], cv.CV_32FC2); // Assuming format for getPerspectiveTransform

    final src = cv.Mat.fromList([
      [tl.x, tl.y],
      [tr.x, tr.y],
      [br.x, br.y],
      [bl.x, bl.y]
    ], cv.CV_32FC2);

    final M = cv.getPerspectiveTransform(src, dst);
    final warped = cv.warpPerspective(image, M, (maxWidth, maxHeight));
    
    return warped;
  }

  static cv.Mat _removeFingers(cv.Mat image) {
    // Basic heuristic approach for Finger Removal:
    // 1. Detect skin-like colors or dark blobs near the left/right edges.
    // 2. Create a mask.
    // 3. Inpaint.
    
    // Convert to HSV for skin detection
    final hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV);
    
    // Skin color range (approximate)
    // Lower: (0, 20, 70), Upper: (20, 255, 255)
    final lower = cv.Scalar(0, 20, 70, 0);
    final upper = cv.Scalar(20, 255, 255, 0);
    
    final mask = cv.inRange(hsv, lower, upper);
    
    // Dilate mask to cover edges of fingers
    final kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (11, 11));
    final dilatedMask = cv.dilate(mask, kernel);

    // Inpaint
    // 3.0 is radius, INPAINT_TELEA is algorithm
    final result = cv.inpaint(image, dilatedMask, 3.0, cv.INPAINT_TELEA);
    
    return result;
  }

  static List<Point<double>> _orderPoints(List<Point<double>> pts) {
    // Basic sorting logic (x + y for tl, x - y for tr, etc.)
    // For simplicity, returning input if already sorted by calling logic
    // Implementation of valid sorting is crucial for correct warp.
    // ... (Simplified for this snippet, assume pts are roughly ordered or use sum/diff method)
    
    pts.sort((a, b) => (a.x).compareTo(b.x)); // Sort by x
    // Split into left and right
    final left = [pts[0], pts[1]];
    final right = [pts[2], pts[3]];
    
    left.sort((a, b) => a.y.compareTo(b.y)); // Top-Left, Bottom-Left
    right.sort((a, b) => a.y.compareTo(b.y)); // Top-Right, Bottom-Right
    
    return [left[0], right[0], right[1], left[1]];
  }
}

class _ProcessData {
  final Uint8List bytes;
  final List<Point<double>> corners;
  _ProcessData(this.bytes, this.corners);
}
