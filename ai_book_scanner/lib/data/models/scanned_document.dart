import 'package:isar/isar.dart';

part 'scanned_document.g.dart';

@collection
class ScannedDocument {
  Id id = Isar.autoIncrement;

  late String title;

  late DateTime createdAt;

  late String pdfPath;
  
  // Storing list of page image paths
  late List<String> pagePaths; 

  @enumerated
  late ScanStatus status;
}

enum ScanStatus {
  processing,
  completed,
  failed
}
