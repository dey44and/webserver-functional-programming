package org.example

import org.example.controllers.ServerWeb

suspend fun main() {
    // Start server
    val serverWeb = ServerWeb()
    serverWeb.run()
}