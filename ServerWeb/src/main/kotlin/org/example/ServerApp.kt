package org.example

import org.example.controllers.ServerWeb

fun main() {
    // Start server
    val serverWeb = ServerWeb()
    serverWeb.run()
}