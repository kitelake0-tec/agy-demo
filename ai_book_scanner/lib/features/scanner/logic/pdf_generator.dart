import 'dart:io';
import 'package:flutter/services.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:image/image.dart' as img;

class PdfService {
  final _textRecognizer = TextRecognizer(script: TextRecognitionScript.korean);

  /// Generates a searchable PDF from a list of image paths.
  /// Standard PDF page is A4.
  Future<File> createSearchablePdf(List<String> imagePaths, String outputPath) async {
    final doc = pw.Document();

    for (final path in imagePaths) {
      final file = File(path);
      final imageBytes = await file.readAsBytes();
      
      // 1. Perform OCR
      final inputImage = InputImage.fromFilePath(path);
      final recognizedText = await _textRecognizer.processImage(inputImage);
      
      // 2. Create PDF Page
      final pdfImage = pw.MemoryImage(imageBytes);
      
      // Decode image to get dimensions for scaling
      final decodedImage = img.decodeImage(imageBytes);
      final double width = decodedImage?.width.toDouble() ?? 595.0;
      final double height = decodedImage?.height.toDouble() ?? 842.0;

      doc.addPage(
        pw.Page(
          pageFormat: PdfPageFormat(width, height), // Match image size or A4
          build: (pw.Context context) {
            return pw.Stack(
              children: [
                // Render Image
                pw.FullPage(
                  ignoreMargins: true,
                  child: pw.Image(pdfImage, fit: pw.BoxFit.fill),
                ),
                
                // Render Transparent Text Overlay
                // We iterate through blocks/lines to position invisible text
                ...recognizedText.blocks.map((block) {
                  return _buildInvisibleTextBlock(block, width, height);
                }).toList(),
              ],
            );
          },
        ),
      );
    }

    final file = File(outputPath);
    await file.writeAsBytes(await doc.save());
    return file;
  }

  pw.Widget _buildInvisibleTextBlock(TextBlock block, double pageWidth, double pageHeight) {
    // Map the rect from image coordinates to PDF coordinates
    // Assuming 1:1 mapping if pageFormat matches image size
    final rect = block.boundingBox;
    
    return pw.Positioned(
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      child: pw.Text(
        block.text,
        style: pw.TextStyle(
          color: PdfColors.transparent, 
          fontSize: 10, // Approximate size, handled by container scaling usually
        ),
      ),
    );
  }

  void dispose() {
    _textRecognizer.close();
  }
}
