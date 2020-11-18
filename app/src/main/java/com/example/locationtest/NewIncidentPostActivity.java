package com.example.locationtest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class NewIncidentPostActivity extends AppCompatActivity {

    private RetrofitInterface retrofitInterface;
    private static final String BASE_URL = "http://52.149.135.175:80";
    private LatLng location;
    private EditText incidentTitleEntry;
    private Spinner incidentSeverityEntry;
    private String incidentSeverity;
    private Button submitButton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_incident_post);

        double latitude, longitude;

        //Get lat and long from map
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            latitude = extras.getDouble("latitude");
            longitude = extras.getDouble("longitude");
            location = new LatLng(latitude, longitude);
        } else {
            latitude = 37.394231;
            longitude = -122.150217;
            location = new LatLng(latitude, longitude);
        }

        // Instantiate retrofit objects
        Retrofit retrofit = new Retrofit.Builder().baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        retrofitInterface = retrofit.create(RetrofitInterface.class);

        // Instantiate text entries and buttons
        incidentTitleEntry = findViewById(R.id.incidentTitleEntry);
        incidentSeverityEntry = findViewById(R.id.incidentSeverityEntry);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.numbers, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        incidentSeverityEntry.setAdapter(adapter);
        incidentSeverityEntry.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                incidentSeverity = parent.getItemAtPosition(position).toString();
                manageSubmitButton();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                incidentSeverity = "";
            }
        });

        incidentTitleEntry.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                manageSubmitButton();
                return false;
            }
        });
        incidentTitleEntry.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if(keyCode == KeyEvent.KEYCODE_ENTER){
                    manageSubmitButton();
                }
                return false;
            }
        });

        submitButton = findViewById(R.id.submitButton);
        Button cancelButton = findViewById(R.id.cancelButton);

        manageSubmitButton();

        // Cancels submission
        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent mapIntent2 = new Intent(NewIncidentPostActivity.this, MapsActivity.class);
                startActivity(mapIntent2);
            }
        });



    }

    public String manageSubmitButton(){
        String submissionError = "Submitted Successfully";
        if (incidentTitleEntry.getText().toString().length() <=5){
            submissionError = getString(R.string.error_title_too_short);
        }else if(incidentTitleEntry.getText().toString().length() >= 50){
            submissionError = getString(R.string.error_title_too_long);
        }else if(incidentSeverity.equals("0")){
            submissionError = "Please select a severity for the incident";
        }

        if (submissionError.equals("Submitted Successfully")){
            submitButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String incidentTitle = incidentTitleEntry.getText().toString();

                    // Hashmap to be sent to server
                    HashMap<String, String> map = new HashMap<>();
                    map.put("title", incidentTitle);
                    map.put("severity", incidentSeverity);
                    map.put("latitude", Double.toString(location.latitude));
                    map.put("longitude", Double.toString(location.longitude));

                    // Send map to server
                    Call<Void> call = retrofitInterface.executeIncident(map);
                    call.enqueue(new Callback<Void>() {
                        @Override
                        public void onResponse(Call<Void> call, Response<Void> response) {
                            if (response.code() == 200) {
                                Toast.makeText(NewIncidentPostActivity.this, "Success", Toast.LENGTH_LONG).show();
                            }

                        }

                        @Override
                        public void onFailure(Call<Void> call, Throwable t) {
                            Toast.makeText(NewIncidentPostActivity.this, t.getMessage(), Toast.LENGTH_LONG).show();

                        }
                    });

                    // Return to map activity and display new incident
                    Intent mapIntent = new Intent(NewIncidentPostActivity.this, MapsActivity.class);
                    mapIntent.putExtra("severity", incidentSeverity);
                    mapIntent.putExtra("title", incidentTitle);
                    mapIntent.putExtra("latitude", location.latitude);
                    mapIntent.putExtra("longitude", location.longitude);
                    startActivity(mapIntent);
                }
            });

        } else {
            String finalSubmissionError = submissionError;
            submitButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(NewIncidentPostActivity.this, finalSubmissionError, Toast.LENGTH_LONG).show();
                }
            });

        }

        return(submissionError);

    }
}