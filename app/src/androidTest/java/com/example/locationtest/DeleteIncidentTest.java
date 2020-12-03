package com.example.locationtest;

import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

@RunWith(AndroidJUnit4ClassRunner.class)
public class DeleteIncidentTest {

    @Rule
    public ActivityScenarioRule<MapsActivity> activityRule = new ActivityScenarioRule<MapsActivity>(MapsActivity.class);

    @Test
    public void deleteIncidentTest() throws InterruptedException {
        Thread.sleep(5000);
        onView(withId(R.id.deleteIncidentButton)).perform(click());
        onView(withId(R.id.deleteIncidentLayout)).check(matches(isDisplayed()));
        onView(withText("DELETE")).perform(click());
        onView(withId(R.id.mapLayout)).check(matches(isDisplayed()));
        onView(withText("No Incident Selected")).inRoot(new ToastMatcher()).check(matches(isDisplayed()));

    }

}
