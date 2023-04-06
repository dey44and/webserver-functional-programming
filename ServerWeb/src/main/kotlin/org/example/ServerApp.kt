package org.example

import org.example.controllers.ServerWeb

fun main() {
    val serverWeb = ServerWeb()
    // Start server
    serverWeb.run()
}