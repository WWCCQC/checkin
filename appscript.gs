function doPost(e) {
  try {
    // ดึงข้อมูลที่ส่งมา
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var output;

    if (action === 'getTechnicians') {
      // เปิด Sheet TechID
      var sheet = SpreadsheetApp.openById('1IqnXRNu4g7FSCS1kbstB7iWzLdq6KGnaeYe1aVAso5o')
                         .getSheetByName('TechID');
      
      // ดึงข้อมูลทั้งหมดจากคอลัมน์ A และ B
      var dataRange = sheet.getRange('A2:B' + sheet.getLastRow()).getValues();
      var technicians = dataRange.map(row => ({
        id: row[0].toString().trim(),
        name: row[1].toString().trim()
      }));

      output = { status: 'success', technicians: technicians };
    } else if (action === 'checkIn') {
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
      
      output = { status: 'success' };
    } else {
      output = { status: 'error', message: 'Invalid action' };
    }

    var response = ContentService.createTextOutput(JSON.stringify(output))
                                 .setMimeType(ContentService.MimeType.JSON);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    var response = ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
}