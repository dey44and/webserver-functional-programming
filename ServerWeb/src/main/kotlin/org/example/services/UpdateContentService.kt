package org.example.services

import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import org.example.interfaces.IUpdateContent
import org.example.model.Person
import java.io.File

class UpdateContentService : IUpdateContent {
    override fun patchData(data: String) {
        // Read content of json
        val fileName = "/home/andrei-iosif/Desktop/Programare Web/proiect-1-andreiiosif/continut/resurse/utilizatori.json"
        val content = File(fileName).inputStream().readBytes().toString(Charsets.UTF_8)

        // Parse data
        val tokens = data.split("&")
        val items = ArrayList<String>()

        // Parse input
        tokens.forEach {
            val (_, item) = it.split("=")
            items.add(item)
        }
        val person = Person(items[0], items[1], items[2], items[3], items[4], items[5], items[6], items[7])

        // Build json
        val gson = GsonBuilder().create()
        val personsList = gson.fromJson<ArrayList<Person>>(content, object : TypeToken<ArrayList<Person>>(){}.type)
        personsList.add(person)

        // Save to file
        val jsonArray = gson.toJson(personsList)
        File(fileName).writeText(jsonArray)
    }
}