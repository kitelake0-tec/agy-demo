import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ai_book_scanner/data/models/scanned_document.dart';

class DbService {
  late Future<Isar> db;

  DbService() {
    db = _initDb();
  }

  Future<Isar> _initDb() async {
    final dir = await getApplicationDocumentsDirectory();
    if (Isar.instanceNames.isEmpty) {
      return await Isar.open(
        [ScannedDocumentSchema],
        directory: dir.path,
      );
    }
    return Future.value(Isar.getInstance());
  }

  Future<void> saveDocument(ScannedDocument doc) async {
    final isar = await db;
    await isar.writeTxn(() async {
      await isar.scannedDocuments.put(doc);
    });
  }

  Future<List<ScannedDocument>> getAllDocuments() async {
    final isar = await db;
    return await isar.scannedDocuments.where().sortByCreatedAtDesc().findAll();
  }
}
