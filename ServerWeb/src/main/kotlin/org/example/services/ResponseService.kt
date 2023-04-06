package org.example.services

import org.example.interfaces.IContentType
import org.example.interfaces.IResponseService
import java.io.File
import java.io.FileInputStream
import java.io.PrintWriter
import java.net.Socket

class ResponseService(private val clientSocket: Socket, private val resource: String): IResponseService {
    private val contentType: IContentType = ContentTypeService()
    override fun setResponse(): String {
        // Create file object
        val file: File = File(resource)
        return when(file.exists()) {
            true -> {
                val fileType = contentType.getContentType(resource.split(".")[1])
                // Wrapper peste fluxul de iesire
                val socketWriter: PrintWriter = PrintWriter(clientSocket.getOutputStream(), true)
                // Start writing metadata
                socketWriter.print("HTTP/1.1 200 OK\r\n")
                socketWriter.print("Content-Length: ${file.length()}\r\n")
                socketWriter.print("Content-Type: ${fileType?.let { contentType.getContentType(it) }}\r\n")
                socketWriter.print("Server: My PW Server\r\n")
                socketWriter.print("\r\n")
                socketWriter.flush()

                // Start writing data
                val content = FileInputStream(file)
                val buffer = ByteArray(1024)
                var length = content.read(buffer)
                while (length != -1) {
                    clientSocket.getOutputStream().write(buffer, 0, length)
                    length = content.read(buffer)
                }
                // Flush and close file
                clientSocket.getOutputStream().flush()
                content.close()
                "INFO: Resource sent succesfully!"
            }
            else -> {
                val message = "Eroare! Resursa $resource nu a fost gasita!"
                // Wrapper peste fluxul de iesire
                val socketWriter: PrintWriter = PrintWriter(clientSocket.getOutputStream(), true)
                // Start writing metadata
                socketWriter.print("HTTP/1.1 404 Not found\r\n")
                socketWriter.print("Content-Length: ${message.toByteArray(Charsets.UTF_8).size}\r\n")
                socketWriter.print("Content-Type: text/plain; charset=utf-8\r\n")
                socketWriter.print("Server: My PW Server\r\n")
                socketWriter.print("\r\n")
                socketWriter.print(message)
                socketWriter.flush()
                "INFO: Resource cannot be found!"
            }
        }
    }
}