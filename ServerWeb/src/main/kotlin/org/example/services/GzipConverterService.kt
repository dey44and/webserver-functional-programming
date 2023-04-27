package org.example.services

import org.example.interfaces.IGzipConverter
import java.io.ByteArrayOutputStream
import java.util.zip.GZIPOutputStream

class GzipConverterService: IGzipConverter {
    override fun encode(uncompressedData: ByteArray): ByteArray {
        // Create output stream
        val compressedDataStream = ByteArrayOutputStream(uncompressedData.size)
        // Create GZIP converter
        val gzipOutputStream = GZIPOutputStream(compressedDataStream)
        // Write data
        gzipOutputStream.write(uncompressedData)
        gzipOutputStream.close()
        return compressedDataStream.toByteArray()
    }
}