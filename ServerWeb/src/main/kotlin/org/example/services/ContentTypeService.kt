package org.example.services

import org.example.interfaces.IContentType

class ContentTypeService: IContentType {
    private val map: HashMap<String, String> = hashMapOf(
        "html" to "text/html; charset=utf-8",
        "css" to "text/css; charset=utf-8",
        "js" to "application/js; charset=utf-8",
        "png" to "image/png",
        "jpg" to "image/jpeg",
        "jpeg" to "image/jpeg",
        "gif" to "image/gif",
        "webp" to "image/webp",
        "ico" to "image/x-icon",
        "xml" to "application/xml; charset=utf-8",
        "json" to "application/json; charset=utf-8"
    )
    override fun getContentType(type: String): String? {
        return map[type]
    }
}