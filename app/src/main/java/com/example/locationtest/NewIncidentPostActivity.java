package com.example.locationtest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.google.android.gms.maps.model.LatLng;

public class NewIncidentPostActivity extends AppCompatActivity {

    private LatLng location;
    private EditText incidentTitleEntry;
    private EditText incidentSeverityEntry;
    private Button submitButton;
    private Button cancelButton;
    private String incidentTitle;
    private int incidentSeverity;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_incident_post);

        //Get lat and long from map
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            Double latitude = extras.getDouble("latitude");
            Double longitude = extras.getDouble("longitude");

            location = new LatLng(latitude, longitude);
        }

        incidentTitleEntry = findViewById(R.id.incidentTitleEntry);
        incidentSeverityEntry = findViewById(R.id.incidentSeverityEntry);
        submitButton = findViewById(R.id.submitButton);
        cancelButton = findViewById(R.id.cancelButton);

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                incidentSeverity = Integer.parseInt(incidentSeverityEntry.getText().toString());
                incidentTitle = incidentTitleEntry.getText().toString();

                Intent mapIntent = new Intent(NewIncidentPostActivity.this, MapsActivity.class);
                mapIntent.putExtra("severity", incidentSeverity);
                mapIntent.putExtra("title", incidentTitle);
                mapIntent.putExtra("latitude", location.latitude);
                mapIntent.putExtra("longitude", location.longitude);
                startActivity(mapIntent);
            }
        });

        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent mapIntent2 = new Intent(NewIncidentPostActivity.this, MapsActivity.class);
                startActivity(mapIntent2);
            }
        });






    }
}