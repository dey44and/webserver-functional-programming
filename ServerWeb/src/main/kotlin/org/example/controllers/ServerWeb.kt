package org.example.controllers

import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.example.interfaces.IResponseService
import org.example.interfaces.IUpdateContent
import org.example.services.ResponseService
import org.example.services.UpdateContentService
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.ServerSocket
import java.net.Socket

class ServerWeb {
    private lateinit var serverSocket: ServerSocket

    @OptIn(DelicateCoroutinesApi::class)
    fun run() {
        // Porneste un server pe portul 5678
        serverSocket = ServerSocket(5678)
        println("----------Server Web Kotlin------------")
        println("Server-ul asculta potentiali clienti...")

        loop@ while(true) {
            try {
                // Asteapta conectarea unui client la server
                val clientSocket: Socket = serverSocket.accept()
                GlobalScope.launch {
                    println("INFO: S-a conectat un client")

                    // Buffer peste fluxul de intrare
                    val socketReader = BufferedReader(InputStreamReader(clientSocket.getInputStream()))

                    // Se citeste prima linie din text, daca aceasta exista
                    socketReader.readLine()?.let {line ->
                        val tokens = line.split(" ")

                        when(tokens[0]) {
                            "GET" -> {
                                // Read input from request
                                //code to read and print headers
                                var headerLine: String?
                                headerLine = socketReader.readLine()
                                while(headerLine?.isNotEmpty() == true){
                                    println(headerLine)
                                    headerLine = socketReader.readLine()
                                }

                                val filePath = "/home/andrei-iosif/Desktop/Programare Web/proiect-1-andreiiosif/" +
                                               "continut${tokens[1]}"
                                // Create response
                                val responseService: IResponseService = ResponseService(clientSocket, filePath)
                                responseService.setResponse()
                            }
                            "POST" -> {
                                // Update data
                                if(tokens[1] == tokens[1]) {
                                    // Read input from request
                                    //code to read and print headers
                                    var headerLine: String?
                                    headerLine = socketReader.readLine()
                                    while(headerLine?.isNotEmpty() == true){
                                        println(headerLine)
                                        headerLine = socketReader.readLine()
                                    }

                                    //code to read the post payload data
                                    val payload: StringBuilder = StringBuilder()
                                    while(socketReader.ready()){
                                        payload.append(socketReader.read().toChar())
                                    }
                                    println("Payload data is: $payload")
                                    // Update service
                                    val updateService: IUpdateContent = UpdateContentService()
                                    updateService.patchData(payload.toString())
                                }
                            }
                        }
                        println("INFO: S-a primit de la client: $tokens")
                    }
                    // Se inchide socket-ul
                    clientSocket.close()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                break@loop
            }
        }
        serverSocket.close()
    }
}