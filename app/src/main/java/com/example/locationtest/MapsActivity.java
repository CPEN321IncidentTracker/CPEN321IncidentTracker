package com.example.locationtest;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.LinkedList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, LocationListener {

    private GoogleMap mMap;
    private LocationManager locationManager;
    private String BASE_URL = "http://52.149.135.175:80";
    final static String TAG = "MapActivity";
    private Button returnHomeButton;
    private Button safetyScoreButton;
    private Button postNewIncidentButton;
    public List<Incident> incidents = new LinkedList<>();
    private LatLng myLocation;
    private Marker blueMarker;
    private static double standardizedDistance = 2; //kilometers
    private Retrofit retrofit;
    private RetrofitInterface retrofitInterface;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        // Initialize home button
        returnHomeButton = findViewById(R.id.returnHomeButton);
        returnHomeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent homeIntent = new Intent(MapsActivity.this, MainActivity.class);
                startActivity(homeIntent);
            }
        });

        // Initialize Safety Score Button
        safetyScoreButton = findViewById(R.id.getSafetyScoreButton);
        safetyScoreButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                double score = 0;
                int nearbyIncidents = 0;

                // Safety score calculation
                for (Incident i : incidents){
                    double distance = i.distanceFrom(blueMarker.getPosition());
                    double result = 0;
                    nearbyIncidents += 1;
                    if(distance < 5){
                        result = 5.0*(i.getSeverity())/5.0;
                    } else if(distance < 7) {
                        result = 4.0*(i.getSeverity())/5.0;
                    } else if(distance < 9) {
                        result = 3.0*(i.getSeverity())/5.0;
                    } else {
                        result = 0.0;
                        nearbyIncidents -= 1;
                    }
                    score += result;
                }

                if (nearbyIncidents==0) {
                    score = 5;
                } else {
                    score = score / nearbyIncidents;
                    
                }

                Toast.makeText(MapsActivity.this, "The safety score at this location is " + score, Toast.LENGTH_LONG).show();
            }
        });

        // Initialize Post New Incident Button
        postNewIncidentButton = findViewById(R.id.addIncidentButton);
        postNewIncidentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent postIncidentIntent = new Intent(MapsActivity.this, NewIncidentPostActivity.class);
                postIncidentIntent.putExtra("latitude", blueMarker.getPosition().latitude);
                postIncidentIntent.putExtra("longitude", blueMarker.getPosition().longitude);
                startActivity(postIncidentIntent);

            }
        });

        // Initialize retrofit objects
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        retrofitInterface = retrofit.create(RetrofitInterface.class);



        // Temporary code to create a list of incidents
        /*incidents.add(new Incident("Some dude was murdered here", 37.4567,-122.11475,5));
        incidents.add(new Incident("Robbery", 37.47347, -122.1349, 3));
        incidents.add(new Incident("Drug Deal :o", 37.4631, -122.13859, 2));*/

        // Add an incident if arriving from submitting an incident
        Bundle extras = getIntent().getExtras();
        if(extras != null){
            Double latitude = extras.getDouble("latitude");
            Double longitude = extras.getDouble("longitude");
            int severity = extras.getInt("severity");
            String title = extras.getString("title");
            incidents.add(new Incident(title,latitude,longitude,severity));
        }


        // Initialize Location Manager; request location update every second
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Wait 5 seconds before displaying current location
        Toast.makeText(MapsActivity.this, "Give us a moment...", Toast.LENGTH_LONG).show();
        (new Handler()).postDelayed(this::displayCurrentLocation, 5000);

        // Call the sever and get the list of incidents
        Call<List<Incident>> call = retrofitInterface.getIncidents();
        call.enqueue(new Callback<List<Incident>>() {
            @Override
            public void onResponse(Call<List<Incident>> call, Response<List<Incident>> response) {
                if (!response.isSuccessful()) {
                    Toast.makeText(MapsActivity.this, "Code: " + response.code(), Toast.LENGTH_LONG).show();
                    return;
                }

                incidents.addAll(response.body());

                // Add markers at incidents from server
                for (Incident i: incidents) {
                    mMap.addMarker(new MarkerOptions().position(i.getLocation()).title(i.getTitle() + " (" + i.getSeverity() + ")"));
                }
                Toast.makeText(MapsActivity.this, "Response was successful", Toast.LENGTH_LONG).show();
            }

            @Override
            public void onFailure(Call<List<Incident>> call, Throwable t) {

                Toast.makeText(MapsActivity.this, t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    // Method to display current location
    private void displayCurrentLocation() {
        blueMarker = mMap.addMarker(new MarkerOptions().position(myLocation).title("You are here").draggable(true).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)));
        mMap.setOnMarkerDragListener(new GoogleMap.OnMarkerDragListener() {
            @Override
            public void onMarkerDragStart(Marker marker) {

            }

            @Override
            public void onMarkerDrag(Marker marker) {

            }

            @Override
            public void onMarkerDragEnd(Marker marker) {

            }
        });
        mMap.moveCamera(CameraUpdateFactory.newLatLng(myLocation));
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(myLocation, 12.0f));
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        Log.d(TAG, "Lat: " + location.getLatitude() + " Long: " + location.getLongitude());
        myLocation = new LatLng(location.getLatitude(), location.getLongitude());

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(@NonNull String provider) {

    }

    @Override
    public void onProviderDisabled(@NonNull String provider) {

    }
}