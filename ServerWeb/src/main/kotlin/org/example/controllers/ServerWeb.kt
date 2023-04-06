package org.example.controllers

import org.example.services.ResponseService
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.ServerSocket
import java.net.Socket

class ServerWeb {
    private lateinit var serverSocket: ServerSocket

    fun run() {
        // Porneste un server pe portul 5678
        serverSocket = ServerSocket(5678)
        println("Server-ul asculta potentiali clienti...")

        while(true) {
            // Asteapta conectarea unui client la server
            val clientSocket: Socket = serverSocket.accept()
            println("INFO: S-a conectat un client")

            // Buffer peste fluxul de intrare
            val socketReader: BufferedReader = BufferedReader(InputStreamReader(clientSocket.getInputStream()))

            // Se citeste prima linie din text, daca aceasta exista
            socketReader.readLine()?.let {line ->
                val tokens = line.split(" ")
                val filePath = "continut${tokens[1]}"

                // Create response
                val responseService = ResponseService(clientSocket, filePath)
                responseService.setResponse()
                println("INFO: S-a primit de la client: $tokens")
            }

            // Se inchide socket-ul
            clientSocket.close()
        }

        serverSocket.close()
    }
}