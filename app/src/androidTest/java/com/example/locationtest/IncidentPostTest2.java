package com.example.locationtest;

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
import static androidx.test.espresso.matcher.ViewMatchers.withText;

@RunWith(AndroidJUnit4ClassRunner.class)
public class IncidentPostTest2 {

    @Rule
    public ActivityScenarioRule<NewIncidentPostActivity> activityRule =
            new ActivityScenarioRule<NewIncidentPostActivity>(NewIncidentPostActivity.class);


    @Test
    public void testTitleTooShort() throws InterruptedException {
        onView(withId(R.id.incidentTitleEntry)).perform(ViewActions.replaceText("A"));
        onView(withId(R.id.incidentTitleEntry)).perform(ViewActions.closeSoftKeyboard());
        Thread.sleep(500);

        onView(withId(R.id.incidentSeverityEntry)).perform(ViewActions.click());
        onView(withText("3")).perform(ViewActions.click());


        onView(withId(R.id.submitButton)).perform(ViewActions.click());
        onView(withText(R.string.error_title_too_short)).inRoot(new ToastMatcher()).check(matches(isDisplayed()));
        onView(withId(R.id.incidentPostLayout)).check(matches(isDisplayed()));
    }
}
