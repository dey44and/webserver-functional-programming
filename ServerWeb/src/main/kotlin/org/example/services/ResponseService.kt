package org.example.services

import org.example.interfaces.IContentType
import org.example.interfaces.IGzipConverter
import org.example.interfaces.IResponseService
import java.io.File
import java.io.FileInputStream
import java.io.PrintWriter
import java.lang.StringBuilder
import java.net.Socket

class ResponseService(private val clientSocket: Socket, private val resource: String): IResponseService {
    private val contentType: IContentType = ContentTypeService()
    override fun setResponse(): String {
        // Create file object
        var file = File(resource)
        return when(file.exists()) {
            true -> {
                val fileType: String? = try {
                    contentType.getContentType(resource.split(".")[1])
                } catch(e: Exception) {
                    file = File("/home/andrei-iosif/Desktop/Programare Web/proiect-1-andreiiosif/continut/index.html")
                    StringBuilder("text/html").toString()
                }
                // Wrapper peste fluxul de iesire
                val socketWriter = PrintWriter(clientSocket.getOutputStream(), true)

                // Start writing data
                val content = FileInputStream(file)

                // Global data to store all
                var globalBuffer = ByteArray(0)
                var globalLength = 0

                // Read data
                val buffer = ByteArray(1024)
                var length = content.read(buffer)
                while (length != -1) {
                    // Update global
                    globalLength += length
                    globalBuffer += buffer

                    length = content.read(buffer)
                }

                // Convert data to gzip
                val realBuffer = globalBuffer.copyOfRange(0, globalLength)
                val gzipConverter: IGzipConverter = GzipConverterService()
                val compressedBuffer = gzipConverter.encode(realBuffer)

                // Start writing metadata
                socketWriter.print("HTTP/1.1 200 OK\r\n")
                socketWriter.print("Content-Length: ${compressedBuffer.size}\r\n")
                socketWriter.print("Content-Type: $fileType\r\n")
                socketWriter.print("Content-Encoding: gzip\r\n")
                socketWriter.print("Server: My PW Server\r\n")
                socketWriter.print("\r\n")
                socketWriter.flush()

                // Flush and close file
                clientSocket.getOutputStream().write(compressedBuffer, 0, compressedBuffer.size)
                clientSocket.getOutputStream().flush()
                content.close()
                "INFO: Resource sent succesfully!"
            }
            else -> {
                val message = "Eroare! Resursa $resource nu a fost gasita!"
                // Wrapper peste fluxul de iesire
                val socketWriter = PrintWriter(clientSocket.getOutputStream(), true)

                // Convert data to gzip
                val gzipConverter: IGzipConverter = GzipConverterService()
                val compressedBuffer = gzipConverter.encode(message.toByteArray())

                // Start writing metadata
                socketWriter.print("HTTP/1.1 404 Not found\r\n")
                socketWriter.print("Content-Length: ${compressedBuffer.size}\r\n")
                socketWriter.print("Content-Encoding: gzip\r\n")
                socketWriter.print("Content-Type: text/plain; charset=utf-8\r\n")
                socketWriter.print("Server: My PW Server\r\n")
                socketWriter.print("\r\n")
                socketWriter.flush()

                // Flush and close file
                clientSocket.getOutputStream().write(compressedBuffer, 0, compressedBuffer.size)
                clientSocket.getOutputStream().flush()

                socketWriter.flush()
                "INFO: Resource cannot be found!"
            }
        }
    }
}