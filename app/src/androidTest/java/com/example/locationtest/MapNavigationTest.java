package com.example.locationtest;

import androidx.test.espresso.action.ViewActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.remote.DesiredCapabilities;

import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.remote.MobileCapabilityType;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static io.appium.java_client.touch.offset.PointOption.point;

@RunWith(AndroidJUnit4ClassRunner.class)
public class MapNavigationTest {


    @Test
    public void testNavigation(){
        DesiredCapabilities dc = new DesiredCapabilities();

        dc.setCapability(MobileCapabilityType.DEVICE_NAME, "emulator-5554");
        dc.setCapability(MobileCapabilityType.PLATFORM_NAME, "android");
        dc.setCapability("appPackage", "com.example.locationtest");
        dc.setCapability("appActivity", ".MainActivity");
        int x;
        int y;

        AndroidDriver<AndroidElement> driver = new AndroidDriver<AndroidElement>(dc);

        MobileElement el1 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el1.click();
        MobileElement el2 = (MobileElement) driver.findElementById("com.android.permissioncontroller:id/permission_allow_foreground_only_button");
        el2.click();
        MobileElement el3 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el3.click();
        (new TouchAction(driver)).press(point(337, 718)).moveTo(point(772, 1148)).release().perform();

        (new TouchAction(driver)).press(point(831, 1456)).moveTo(point(352, 919)).release().perform();

        MobileElement el4 = (MobileElement) driver.findElementByAccessibilityId("You are here. ");
        el4.click();
        MobileElement el5 = (MobileElement) driver.findElementByAccessibilityId("Zoom out");
        el5.click();
        MobileElement el6 = (MobileElement) driver.findElementByAccessibilityId("Zoom in");
        el6.click();
        MobileElement el7 = (MobileElement) driver.findElementByAccessibilityId("Cybercrime (2). ");
        el7.click();
        MobileElement el8 = (MobileElement) driver.findElementByAccessibilityId("My Location");
        el8.click();



    }
}
