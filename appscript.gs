function doGet(e) {
  try {
    if (e.parameter.type === 'getTechnicians') {
      // เปิด Sheet TechID
      var sheet = SpreadsheetApp.openById('1IqnXRNu4g7FSCS1kbstB7iWzLdq6KGnaeYe1aVAso5o')
                         .getSheetByName('TechID');
      
      // ดึงข้อมูลจากคอลัมน์ A, B, C ตั้งแต่แถว 2
      var lastRow = sheet.getLastRow();
      if (lastRow < 2) {
        // กรณีไม่มีข้อมูล
        return ContentService.createTextOutput(
          JSON.stringify({ status: 'success', technicians: [] })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      var data = sheet.getRange('A2:C' + lastRow).getValues(); 
      var technicians = data.map(row => ({
        jobId: row[0] ? row[0].toString().trim() : '', // Job ID จากคอลัมน์ A
        id: row[1] ? row[1].toString().trim() : '',    // เลขบัตร 4 หลัก จากคอลัมน์ B
        name: row[2] ? row[2].toString().trim() : ''     // ชื่อช่าง จากคอลัมน์ C
      }));

      // กรองข้อมูลที่ jobId ไม่ใช่ค่าว่างออก (ถ้าต้องการ)
      technicians = technicians.filter(tech => tech.jobId !== '');

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
    
    // เพิ่ม header ถ้ายังไม่มี (เพิ่ม Job ID)
    if (sheet.getLastRow() === 0) {
      //                A        B       C                       D                   E           F        G          H
      sheet.appendRow(['วันที่', 'เวลา', 'ไอดีช่างที่รับงาน', 'เลขบัตร 4 ตัวท้าย', 'ชื่อช่าง', 'สถานะ', 'ละติจูด', 'ลองจิจูด']);
    }
    
    // บันทึกข้อมูล (เพิ่ม Job ID)
    sheet.appendRow([
      data.date,                   // วันที่
      data.time,                   // เวลา
      data.technicianJobId,        // ไอดีช่างที่รับงาน (Job ID)
      data.technicianId,           // เลขบัตร 4 ตัวท้าย (ส่งมาจาก client ในชื่อ technicianId)
      data.technicianName,         // ชื่อช่าง
      data.status,                 // สถานะ
      data.latitude,               // ละติจูด
      data.longitude               // ลองจิจูด
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