package com.example.locationtest;

import android.view.View;

import androidx.test.espresso.action.ViewActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

@RunWith(AndroidJUnit4ClassRunner.class)
public class activityNavigationTest {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule = new ActivityScenarioRule<MainActivity>(MainActivity.class);

    @Test
    public void testActivityNavigation() throws InterruptedException {
        onView(withId(R.id.maps_button)).perform(ViewActions.click());
        onView(withId(R.id.mapLayout)).check(matches(isDisplayed()));

        Thread.sleep(5000);

        onView(withId(R.id.addIncidentButton)).perform(ViewActions.click());
        onView(withId(R.id.incidentPostLayout)).check(matches(isDisplayed()));

        onView(withId(R.id.cancelButton)).perform(ViewActions.click());
        onView(withId(R.id.mapLayout)).check(matches(isDisplayed()));

        onView(withId(R.id.returnHomeButton)).perform(ViewActions.click());
        onView(withId(R.id.activity_main)).check(matches(isDisplayed()));

        onView(withId(R.id.eResourcesButton)).perform(ViewActions.click());
        onView(withId(R.id.boxInsetLayout)).check(matches(isDisplayed()));


    }


}
