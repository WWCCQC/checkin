function doGet(e) {
  try {
    if (e.parameter.type === 'getTechnicians') {
      // เปิด Sheet TechID
      var sheet = SpreadsheetApp.openById('1IqnXRNu4g7FSCS1kbstB7iWzLdq6KGnaeYe1aVAso5o')
                         .getSheetByName('TechID');
      
      // ดึงข้อมูลทั้งหมดจากคอลัมน์ A และ B
      var data = sheet.getRange('A2:B' + sheet.getLastRow()).getValues();
      var technicians = data.map(row => ({
        id: row[0].toString(),
        name: row[1]
      }));

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', technicians: technicians })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // ดึงข้อมูลที่ส่งมา
    var data = JSON.parse(e.postData.contents);
    
    // เปิด Sheet CheckIn
    var sheet = SpreadsheetApp.openById('1IqnXRNu4g7FSCS1kbstB7iWzLdq6KGnaeYe1aVAso5o')
                       .getSheetByName('CheckIn') || 
                SpreadsheetApp.openById('1IqnXRNu4g7FSCS1kbstB7iWzLdq6KGnaeYe1aVAso5o')
                       .insertSheet('CheckIn');
    
    // เพิ่ม header ถ้ายังไม่มี
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['วันที่', 'เวลา', 'ไอดีช่าง', 'ชื่อช่าง', 'สถานะ', 'ละติจูด', 'ลองจิจูด']);
    }
    
    // บันทึกข้อมูล
    sheet.appendRow([
      data.date,
      data.time,
      data.technicianId,
      data.technicianName,
      data.status,
      data.latitude,
      data.longitude
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}