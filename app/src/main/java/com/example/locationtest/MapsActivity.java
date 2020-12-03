package com.example.locationtest;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.SearchView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, LocationListener, DeleteDialog.DeleteDialogListener {

    private GoogleMap mMap;
    private static final String BASE_URL = "http://52.149.135.175:80";
    private final static String TAG = "MapActivity";
    private final static double nearbyDistance = 4; //km
    public List<Incident> incidents = new LinkedList<>();
    private LatLng myLocation;
    private Marker blueMarker;
    private RetrofitInterface retrofitInterface;
    private Incident selectedIncident;
    private boolean incidentSelected = false;
    private Circle safetyCircle;


    @SuppressLint("MissingPermission")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        // Initialize the search bar
        SearchView searchView;
        searchView = findViewById(R.id.sv_location);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return getQueryResult(searchView);
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

        // Initialize buttons
        buttonSetup();

        // Initialize retrofit interface for HTTP get
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        retrofitInterface = retrofit.create(RetrofitInterface.class);

        // Initialize Location Manager; request location update every second
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
    }

    // Display map once it is available
    @SuppressLint("MissingPermission")
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng latLng) {
                safetyCircle.remove();
                blueMarker.setPosition(latLng);
                displayNearbyRadius();
                incidentSelected = false;
            }
        });
        mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                String markerTitle = marker.getTitle();
                if (!markerTitle.equals("You are here")){
                    incidentSelected = true;
                    String incidentTitle = markerTitle.split(" -> Severity: ", 2)[0];
                    int incidentSeverity = Integer.parseInt(markerTitle.split(" -> Severity: ", 2)[1]);
                    double latitude = marker.getPosition().latitude;
                    double longitude = marker.getPosition().longitude;
                    selectedIncident = new Incident(incidentTitle, latitude, longitude, incidentSeverity);
                }
                return false;
            }
        });


        // Enable all functionality for map navigation
        mMap.setMyLocationEnabled(true);
        UiSettings mUiSettings = mMap.getUiSettings();
        mUiSettings.setAllGesturesEnabled(true);
        mUiSettings.setZoomControlsEnabled(true);
        mUiSettings.setMyLocationButtonEnabled(true);
        mMap.setOnMyLocationButtonClickListener(new GoogleMap.OnMyLocationButtonClickListener() {
            @Override
            public boolean onMyLocationButtonClick() {
                blueMarker.setPosition(myLocation);
                return false;
            }
        });

        // Wait 1.5 seconds before displaying current location
        (new Handler()).postDelayed(this::displayCurrentLocation, 1500);

        // Call the sever and get the list of incidents
        retrieveIncidents();

    }

    private void retrieveIncidents() {
        Call<List<Incident>> call = retrofitInterface.getIncidents();
        call.enqueue(new Callback<List<Incident>>() {
            @Override
            public void onResponse(Call<List<Incident>> call, Response<List<Incident>> response) {
                if (!response.isSuccessful()) {
                    Toast.makeText(MapsActivity.this, "Code: " + response.code(), Toast.LENGTH_LONG).show();
                    return;
                }

                // Add incidents from HTTP response
                incidents.clear();
                incidents.addAll(response.body());

                // Add markers at incidents from server
                for (Incident i : incidents) {

                    mMap.addMarker(new MarkerOptions().position(i.getLocation()).title(i.getTitle() + " -> Severity: " + i.getSeverity()));
                }
            }

            @Override
            public void onFailure(Call<List<Incident>> call, Throwable t) {
                Toast.makeText(MapsActivity.this, t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }


    private void buttonSetup() {
        // Initialize home button
        Button returnHomeButton = findViewById(R.id.returnHomeButton);
        returnHomeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent homeIntent = new Intent(MapsActivity.this, MainActivity.class);
                startActivity(homeIntent);
            }
        });

        // Initialize Safety Score Button
        Button safetyScoreButton = findViewById(R.id.getSafetyScoreButton);
        safetyScoreButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    computeSafetyScore();
                } catch (IOException e) {
                    Toast.makeText(MapsActivity.this, "Error", Toast.LENGTH_LONG).show();
                }
            }
        });

        // Initialize Post New Incident Button
        Button postNewIncidentButton = findViewById(R.id.addIncidentButton);
        postNewIncidentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent postIncidentIntent = new Intent(MapsActivity.this, NewIncidentPostActivity.class);
                postIncidentIntent.putExtra("latitude", blueMarker.getPosition().latitude);
                postIncidentIntent.putExtra("longitude", blueMarker.getPosition().longitude);
                startActivity(postIncidentIntent);

            }
        });

        Button deleteIncidentButton = findViewById(R.id.deleteIncidentButton);
        deleteIncidentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DeleteDialog deleteDialog = new DeleteDialog();
                deleteDialog.show(getSupportFragmentManager(), "delete dialog");
            }
        });
    }


    // Go to the result of search bar query
    private boolean getQueryResult(SearchView searchView) {
        String result = searchView.getQuery().toString();
        List<Address> addressList = null;

        if (result != null && !result.equals("")) {
            Geocoder geocoder = new Geocoder(MapsActivity.this);
            try {
                addressList = geocoder.getFromLocationName(result, 1);
                Address address = addressList.get(0);
                LatLng latLng = new LatLng(address.getLatitude(), address.getLongitude());
                blueMarker.setPosition(latLng);
                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 10));
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
        return false;
    }


    // Calculate the safety score at the blue marker based on number of nearby incidents
    private void computeSafetyScore() throws IOException {

        Call<ScoreMessage> call = retrofitInterface.getSafetyScore(String.valueOf((float) blueMarker.getPosition().latitude), String.valueOf((float)blueMarker.getPosition().longitude));
        call.enqueue(new Callback<ScoreMessage>() {
            @Override
            public void onResponse(Call<ScoreMessage> call, Response<ScoreMessage> response) {
                Toast.makeText(MapsActivity.this, response.body().score, Toast.LENGTH_LONG).show();
            }

            @Override
            public void onFailure(Call<ScoreMessage> call, Throwable t) {
                Toast.makeText(MapsActivity.this, t.getMessage(), Toast.LENGTH_LONG).show();

            }
        });

    }

    private void displayNearbyRadius() {
        CircleOptions options = new CircleOptions()
                .center(blueMarker.getPosition())
                .radius(1000*nearbyDistance)
                .fillColor(0x33FF0000)
                .strokeColor(Color.BLACK)
                .strokeWidth(3);
        safetyCircle = mMap.addCircle(options);
    }


    // Method to display current location
    private void displayCurrentLocation() {
        blueMarker = mMap.addMarker(new MarkerOptions().position(myLocation).title("You are here").draggable(true).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)));
        mMap.setOnMarkerDragListener(new GoogleMap.OnMarkerDragListener() {
            @Override
            public void onMarkerDragStart(Marker marker) {
                safetyCircle.remove();
                blueMarker.setIcon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE));
            }

            @Override
            public void onMarkerDrag(Marker marker) {
                blueMarker.setIcon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE));
            }

            @Override
            public void onMarkerDragEnd(Marker marker) {
                displayNearbyRadius();
                blueMarker.setIcon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));
            }
        });
        mMap.moveCamera(CameraUpdateFactory.newLatLng(myLocation));
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(myLocation, 12.0f));
        displayNearbyRadius();
    }


    @Override
    public void onLocationChanged(@NonNull Location location) {
        Log.d(TAG, "Lat: " + location.getLatitude() + " Long: " + location.getLongitude());
        myLocation = new LatLng(location.getLatitude(), location.getLongitude());

    }

    @Override
    public void applyTexts(String password) {
        if (password.equals("Cpen321") && incidentSelected){
            Call<Void> call = retrofitInterface.deleteIncident(selectedIncident);
            call.enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    Toast.makeText(MapsActivity.this, "Incident Deleted", Toast.LENGTH_LONG).show();
                    mMap.clear();

                    (new Handler()).postDelayed(MapsActivity.this::retrieveIncidents, 1500);

                    displayCurrentLocation();
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(MapsActivity.this, t.getMessage(), Toast.LENGTH_LONG).show();

                }
            });
        } else if (incidentSelected) {
            Toast.makeText(MapsActivity.this, "Incorrect Password", Toast.LENGTH_LONG).show();
        } else {
            Toast.makeText(MapsActivity.this, "No Incident Selected", Toast.LENGTH_LONG).show();
        }
    }
}