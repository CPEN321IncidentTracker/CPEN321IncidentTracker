package com.example.locationtest;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface RetrofitInterface {


    @POST("/incident")
    Call<Void> executeIncident(@Body HashMap<String, String> map);

    @GET("/incident")
    Call<List<Incident>> getIncidents();

    @GET("/score/{latitude}/{longitude}")
    Call<ScoreMessage> getSafetyScore(@Path("latitude") String lat, @Path("longitude") String lon);

    @POST("/delete")
    Call<Void> deleteIncident(@Body Incident incident);


}
