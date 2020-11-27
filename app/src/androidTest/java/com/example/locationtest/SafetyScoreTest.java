package com.example.locationtest;

import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.remote.DesiredCapabilities;

import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.remote.MobileCapabilityType;
import io.appium.java_client.touch.offset.PointOption;

import static io.appium.java_client.touch.offset.PointOption.point;

@RunWith(AndroidJUnit4ClassRunner.class)
public class SafetyScoreTest {

    @Test
    public void testSafetyScore(){
        DesiredCapabilities dc = new DesiredCapabilities();

        dc.setCapability(MobileCapabilityType.DEVICE_NAME, "emulator-5554");
        dc.setCapability(MobileCapabilityType.PLATFORM_NAME, "android");
        dc.setCapability("appPackage", "com.example.locationtest");
        dc.setCapability("appActivity", ".MainActivity");


        AndroidDriver<AndroidElement> driver = new AndroidDriver<AndroidElement>(dc);

        MobileElement el1 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el1.click();
        MobileElement el2 = (MobileElement) driver.findElementById("com.android.permissioncontroller:id/permission_allow_foreground_only_button");
        el2.click();
        MobileElement el3 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el3.click();

        MobileElement el7 = (MobileElement) driver.findElementByAccessibilityId("Incident 6 (1). ");
        el7.click();
        MobileElement el8 = (MobileElement) driver.findElementByAccessibilityId("Zoom in");
        el8.click();
        (new TouchAction(driver)).tap(point(181, 1114)).perform();
        MobileElement el9 = (MobileElement) driver.findElementById("com.example.locationtest:id/getSafetyScoreButton");
        el9.click();
        (new TouchAction(driver)).tap(point(450, 1070)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(181, 1114)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(450, 1070)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(181, 1114)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(450, 1070)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(181, 1114)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(450, 1070)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(181, 1114)).perform();
        el9.click();
        (new TouchAction(driver)).tap(point(450, 1070)).perform();
        el9.click();

    }


}
