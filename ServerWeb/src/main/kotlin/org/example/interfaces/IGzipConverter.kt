package org.example.interfaces

interface IGzipConverter {
    fun encode(uncompressedData: ByteArray): ByteArray
}