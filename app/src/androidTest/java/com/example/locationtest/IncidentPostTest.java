package com.example.locationtest;

import android.os.Handler;
import android.view.KeyEvent;
import android.view.View;

import androidx.test.espresso.action.ViewActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.MalformedURLException;
import java.net.URL;

import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.remote.MobileCapabilityType;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static io.appium.java_client.touch.offset.PointOption.point;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

@RunWith(AndroidJUnit4ClassRunner.class)
public class IncidentPostTest {
    @Rule
    public ActivityScenarioRule<NewIncidentPostActivity> activityRule =
            new ActivityScenarioRule<NewIncidentPostActivity>(NewIncidentPostActivity.class);

    @Test
    public void testTitleTooLong() throws InterruptedException {

        onView(withId(R.id.incidentTitleEntry)).
                perform(ViewActions.replaceText("123456789012345678901234567890123456789012345678901234567890"));
        onView(withId(R.id.incidentTitleEntry)).perform(ViewActions.closeSoftKeyboard());
        Thread.sleep(500);

        onView(withId(R.id.incidentSeverityEntry)).perform(ViewActions.click());
        onView(withText("3")).perform(ViewActions.click());

        onView(withId(R.id.submitButton)).perform(ViewActions.click());
        onView(withText(R.string.error_title_too_long)).inRoot(new ToastMatcher()).check(matches(isDisplayed()));
        onView(withId(R.id.incidentPostLayout)).check(matches(isDisplayed()));

    }

    @Test
    public void testCorrectLength() throws InterruptedException {
        onView(withId(R.id.incidentTitleEntry)).perform(ViewActions.replaceText("Proper Incident"));
        onView(withId(R.id.incidentTitleEntry)).perform(ViewActions.closeSoftKeyboard());

        Thread.sleep(500);
        onView(withId(R.id.incidentSeverityEntry)).perform(ViewActions.click());
        onView(withText("3")).perform(ViewActions.click());


        onView(withId(R.id.submitButton)).perform(ViewActions.click());
        Thread.sleep(500);
        onView(withId(R.id.mapLayout)).check(matches(isDisplayed()));
    }

    /*@Test
    public void testTitleTooLong() throws MalformedURLException {
        DesiredCapabilities dc = new DesiredCapabilities();

        dc.setCapability(MobileCapabilityType.DEVICE_NAME, "emulator-5554");
        dc.setCapability(MobileCapabilityType.PLATFORM_NAME, "android");
        dc.setCapability("appPackage", "com.example.locationtest");
        dc.setCapability("appActivity", ".MainActivity");
        int x;
        int y;

        AndroidDriver<AndroidElement> driver = new AndroidDriver<AndroidElement>(dc);

        MobileElement el3 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el3.click();
        (new TouchAction(driver)).press(point(459, 591)).moveTo(point(787, 1026)).release().perform();

        MobileElement el4 = (MobileElement) driver.findElementById("com.example.locationtest:id/addIncidentButton");
        el4.click();
        MobileElement el5 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentTitleEntry");
        el5.click();
        MobileElement el6 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentPostLayout");
        el6.click();
        MobileElement el7 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentTitleEntry");
        el7.click();
        el7.sendKeys("Hello this will be a very long message, surely longer than 50 characters and thus you cannot submit an incident!!!!!!!! ");
        MobileElement el8 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentSeverityEntry");
        el8.click();
        MobileElement el9 = (MobileElement) driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ListView/android.widget.CheckedTextView[3]");
        el9.click();
        (new TouchAction(driver)).tap(point(889, 875)).perform();
        (new TouchAction(driver)).tap(point(977, 1925)).perform();
        MobileElement el10 = (MobileElement) driver.findElementById("com.example.locationtest:id/submitButton");
        el10.click();


    }*/
}
