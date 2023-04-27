package org.example.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class Person(
    @SerializedName("username") @Expose var username: String? = null,
    @SerializedName("password") @Expose var password: String? = null,
    @SerializedName("name") @Expose var name: String? = null,
    @SerializedName("firstName") @Expose var firstName: String? = null,
    @SerializedName("email") @Expose var email: String? = null,
    @SerializedName("phone") @Expose var phone: String? = null,
    @SerializedName("date") @Expose var date: String? = null,
    @SerializedName("url") @Expose var url: String? = null
)
