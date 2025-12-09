function doGet() {
  try {
    var fileIdHtml = "- - - - - - - - - - - - - - - - - -"; // Reemplázalo con el ID real del HTML
    var cssFolderId = "- - - - - - - - - - - - - - - - - -"; // Reemplázalo con el ID de la carpeta CSS
    var jsFolderId = "- - - - - - - - - - - - - - - - - -";   // Reemplázalo con el ID de la carpeta JS

    // Leer HTML desde Drive
    var htmlContent = DriveApp.getFileById(fileIdHtml).getBlob().getDataAsString("UTF-8");

    // Obtener todos los archivos CSS dentro de la carpeta
    var cssContent = getFilesContentFromFolder(cssFolderId);

    // Obtener todos los archivos JS dentro de la carpeta
    var jsContent = getFilesContentFromFolder(jsFolderId);

    // Insertar el CSS dentro del <head>
    htmlContent = htmlContent.replace("</head>", "<style>" + cssContent + "</style></head>");

    // Insertar el JS antes de </body>
    htmlContent = htmlContent.replace("</body>", "<script>" + jsContent + "</script></body>");

    return HtmlService.createHtmlOutput(htmlContent)
      .setTitle("Mi Aplicación Web desde Drive")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (e) {
    return HtmlService.createHtmlOutput("<h1>Error al cargar los archivos</h1><p>" + e.message + "</p>");
  }
}

/**
 * Función que obtiene el contenido de todos los archivos dentro de una carpeta en Google Drive.
 */
function getFilesContentFromFolder(folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var contents = [];

    while (files.hasNext()) {
      var file = files.next();
      try {
        // Verificar si el archivo es de texto antes de intentar leerlo
        if (file.getMimeType().startsWith("text") || file.getMimeType() === "application/json") {
          contents.push("\n" + file.getBlob().getDataAsString("UTF-8"));
        } else {
          contents.push("\n/* Archivo ignorado: " + file.getName() + " (" + file.getMimeType() + ") */");
        }
      } catch (e) {
        contents.push("\n/* Error al cargar archivo " + file.getName() + ": " + e.message + " */");
      }
    }

    return contents.join("");
  } catch (e) {
    return "/* Error al acceder a la carpeta: " + e.message + " */";
  }
}


function grabarEmail(email) {
  try {
    var libro = SpreadsheetApp.openById("- - - - - - - - - - - - - - - - - -");
    var hoja = libro.getSheetByName("Datos");
    hoja.appendRow([new Date(), email]);

    // Enviar correo de confirmación
    enviarCorreo(email);

  } catch (e) {
    throw new Error("Error al guardar los datos: " + e.message);
  }
}

function enviarCorreo(email) {
  try {
    var subject = "¡Gracias por registrarte!";
    /*var message = "Hola,\n\nGracias por suscribirte. Recibimos tu correo correctamente.\n\nSaludos,\nTu equipo";*/
    var personalizedHtmlBody = HtmlService.createHtmlOutputFromFile('mail').getContent();
    
    var subject = "¡Te damos la bienvenida! ✅ ¡Empecemos!";
    var advancedOpts = {
      name: "LeoDev",
      htmlBody: personalizedHtmlBody
      /*attachments: [archivo]*/ };
    
    GmailApp.sendEmail(email, subject, "", advancedOpts);
    
  } catch (e) {
    throw new Error("Error al enviar el correo: " + e.message);
  }
}

