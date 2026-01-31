// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scanned_document.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetScannedDocumentCollection on Isar {
  IsarCollection<ScannedDocument> get scannedDocuments => this.collection();
}

const ScannedDocumentSchema = CollectionSchema(
  name: r'ScannedDocument',
  id: -565521139992128677,
  properties: {
    r'createdAt': PropertySchema(
      id: 0,
      name: r'createdAt',
      type: IsarType.dateTime,
    ),
    r'pagePaths': PropertySchema(
      id: 1,
      name: r'pagePaths',
      type: IsarType.stringList,
    ),
    r'pdfPath': PropertySchema(
      id: 2,
      name: r'pdfPath',
      type: IsarType.string,
    ),
    r'status': PropertySchema(
      id: 3,
      name: r'status',
      type: IsarType.byte,
      enumMap: _ScannedDocumentstatusEnumValueMap,
    ),
    r'title': PropertySchema(
      id: 4,
      name: r'title',
      type: IsarType.string,
    )
  },
  estimateSize: _scannedDocumentEstimateSize,
  serialize: _scannedDocumentSerialize,
  deserialize: _scannedDocumentDeserialize,
  deserializeProp: _scannedDocumentDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embeddedSchemas: {},
  getId: _scannedDocumentGetId,
  getLinks: _scannedDocumentGetLinks,
  attach: _scannedDocumentAttach,
  version: '3.1.0+1',
);

int _scannedDocumentEstimateSize(
  ScannedDocument object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.pagePaths.length * 3;
  {
    for (var i = 0; i < object.pagePaths.length; i++) {
      final value = object.pagePaths[i];
      bytesCount += value.length * 3;
    }
  }
  bytesCount += 3 + object.pdfPath.length * 3;
  bytesCount += 3 + object.title.length * 3;
  return bytesCount;
}

void _scannedDocumentSerialize(
  ScannedDocument object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeDateTime(offsets[0], object.createdAt);
  writer.writeStringList(offsets[1], object.pagePaths);
  writer.writeString(offsets[2], object.pdfPath);
  writer.writeByte(offsets[3], object.status.index);
  writer.writeString(offsets[4], object.title);
}

ScannedDocument _scannedDocumentDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = ScannedDocument();
  object.createdAt = reader.readDateTime(offsets[0]);
  object.id = id;
  object.pagePaths = reader.readStringList(offsets[1]) ?? [];
  object.pdfPath = reader.readString(offsets[2]);
  object.status =
      _ScannedDocumentstatusValueEnumMap[reader.readByteOrNull(offsets[3])] ??
          ScanStatus.processing;
  object.title = reader.readString(offsets[4]);
  return object;
}

P _scannedDocumentDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readDateTime(offset)) as P;
    case 1:
      return (reader.readStringList(offset) ?? []) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (_ScannedDocumentstatusValueEnumMap[
              reader.readByteOrNull(offset)] ??
          ScanStatus.processing) as P;
    case 4:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

const _ScannedDocumentstatusEnumValueMap = {
  'processing': 0,
  'completed': 1,
  'failed': 2,
};
const _ScannedDocumentstatusValueEnumMap = {
  0: ScanStatus.processing,
  1: ScanStatus.completed,
  2: ScanStatus.failed,
};

Id _scannedDocumentGetId(ScannedDocument object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _scannedDocumentGetLinks(ScannedDocument object) {
  return [];
}

void _scannedDocumentAttach(
    IsarCollection<dynamic> col, Id id, ScannedDocument object) {
  object.id = id;
}

extension ScannedDocumentQueryWhereSort
    on QueryBuilder<ScannedDocument, ScannedDocument, QWhere> {
  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension ScannedDocumentQueryWhere
    on QueryBuilder<ScannedDocument, ScannedDocument, QWhereClause> {
  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhereClause> idEqualTo(
      Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhereClause>
      idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhereClause>
      idGreaterThan(Id id, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhereClause> idLessThan(
      Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension ScannedDocumentQueryFilter
    on QueryBuilder<ScannedDocument, ScannedDocument, QFilterCondition> {
  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      createdAtEqualTo(DateTime value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      createdAtGreaterThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      createdAtLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      createdAtBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'createdAt',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'pagePaths',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'pagePaths',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'pagePaths',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'pagePaths',
        value: '',
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsElementIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'pagePaths',
        value: '',
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsLengthEqualTo(int length) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        length,
        true,
        length,
        true,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        0,
        true,
        0,
        true,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        0,
        false,
        999999,
        true,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsLengthLessThan(
    int length, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        0,
        true,
        length,
        include,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsLengthGreaterThan(
    int length, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        length,
        include,
        999999,
        true,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pagePathsLengthBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'pagePaths',
        lower,
        includeLower,
        upper,
        includeUpper,
      );
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'pdfPath',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'pdfPath',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'pdfPath',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'pdfPath',
        value: '',
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      pdfPathIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'pdfPath',
        value: '',
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      statusEqualTo(ScanStatus value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'status',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      statusGreaterThan(
    ScanStatus value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'status',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      statusLessThan(
    ScanStatus value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'status',
        value: value,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      statusBetween(
    ScanStatus lower,
    ScanStatus upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'status',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'title',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'title',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'title',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'title',
        value: '',
      ));
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterFilterCondition>
      titleIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'title',
        value: '',
      ));
    });
  }
}

extension ScannedDocumentQueryObject
    on QueryBuilder<ScannedDocument, ScannedDocument, QFilterCondition> {}

extension ScannedDocumentQueryLinks
    on QueryBuilder<ScannedDocument, ScannedDocument, QFilterCondition> {}

extension ScannedDocumentQuerySortBy
    on QueryBuilder<ScannedDocument, ScannedDocument, QSortBy> {
  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      sortByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      sortByCreatedAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> sortByPdfPath() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'pdfPath', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      sortByPdfPathDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'pdfPath', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> sortByStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'status', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      sortByStatusDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'status', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> sortByTitle() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'title', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      sortByTitleDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'title', Sort.desc);
    });
  }
}

extension ScannedDocumentQuerySortThenBy
    on QueryBuilder<ScannedDocument, ScannedDocument, QSortThenBy> {
  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      thenByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      thenByCreatedAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> thenByPdfPath() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'pdfPath', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      thenByPdfPathDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'pdfPath', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> thenByStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'status', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      thenByStatusDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'status', Sort.desc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy> thenByTitle() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'title', Sort.asc);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QAfterSortBy>
      thenByTitleDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'title', Sort.desc);
    });
  }
}

extension ScannedDocumentQueryWhereDistinct
    on QueryBuilder<ScannedDocument, ScannedDocument, QDistinct> {
  QueryBuilder<ScannedDocument, ScannedDocument, QDistinct>
      distinctByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'createdAt');
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QDistinct>
      distinctByPagePaths() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'pagePaths');
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QDistinct> distinctByPdfPath(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'pdfPath', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QDistinct> distinctByStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'status');
    });
  }

  QueryBuilder<ScannedDocument, ScannedDocument, QDistinct> distinctByTitle(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'title', caseSensitive: caseSensitive);
    });
  }
}

extension ScannedDocumentQueryProperty
    on QueryBuilder<ScannedDocument, ScannedDocument, QQueryProperty> {
  QueryBuilder<ScannedDocument, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<ScannedDocument, DateTime, QQueryOperations>
      createdAtProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'createdAt');
    });
  }

  QueryBuilder<ScannedDocument, List<String>, QQueryOperations>
      pagePathsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'pagePaths');
    });
  }

  QueryBuilder<ScannedDocument, String, QQueryOperations> pdfPathProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'pdfPath');
    });
  }

  QueryBuilder<ScannedDocument, ScanStatus, QQueryOperations> statusProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'status');
    });
  }

  QueryBuilder<ScannedDocument, String, QQueryOperations> titleProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'title');
    });
  }
}
