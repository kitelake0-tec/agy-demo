/**
 * [사내 위키 시스템 v3.1 - 데이터 직렬화 완벽 방어 버전]
 */
function _getSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    DOCS: ss.getSheetByName('Docs'),
    HISTORY: ss.getSheetByName('History')
  };
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('사내 위키 시스템')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInitialData() {
  const docs = _getAllDocs();
  return {
    docs: docs,
    categories: [...new Set(docs.map(d => d.category))].filter(Boolean)
  };
}

function saveDoc(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheets = _getSheets();
    const sheet = sheets.DOCS;
    const data = sheet.getDataRange().getValues();
    const docId = payload.id || Utilities.getUuid();
    const now = new Date(); 
    const authorName = "사내 멤버";

    let rowIndex = data.findIndex(row => row[0] === docId);

    if (rowIndex === -1) {
      sheet.appendRow([docId, payload.title, payload.content, payload.category, payload.format, authorName, now, 'active']);
    } else {
      const r = rowIndex + 1;
      sheets.HISTORY.appendRow([Utilities.getUuid(), docId, data[rowIndex][2], authorName, now]);
      sheet.getRange(r, 2, 1, 6).setValues([[payload.title, payload.content, payload.category, payload.format, authorName, now]]);
    }

    return { success: true, id: docId };
  } catch (e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function _getAllDocs() {
  const sheets = _getSheets();
  if(!sheets.DOCS) return []; 
  const data = sheets.DOCS.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data.shift();
  return data
    .filter(row => row[7] === 'active')
    .map(row => {
      // 🚨 핵심 방어 로직: Date 객체가 프론트엔드로 넘어가서 화면이 백지화되는 것을 원천 차단
      let dateVal = row[6];
      let safeDate = new Date().toISOString(); 
      if (dateVal instanceof Date) { safeDate = dateVal.toISOString(); }
      else if (dateVal) { safeDate = new Date(dateVal).toISOString(); }

      return {
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        content: String(row[2] || ''),
        category: String(row[3] || '미분류'),
        format: String(row[4] || 'markdown'),
        author: String(row[5] || '사내 멤버'),
        updated_at: safeDate // 에러가 나지 않는 완벽한 문자열로 전달
      };
    })
    .reverse();
}

function deleteDoc(docId) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = _getSheets().DOCS;
    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === docId);
    if (rowIndex === -1) return { success: false, error: '문서를 찾을 수 없습니다.' };
    // 실제 삭제 대신 status를 'deleted'로 변경 (소프트 삭제)
    sheet.getRange(rowIndex + 1, 8).setValue('deleted');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}
