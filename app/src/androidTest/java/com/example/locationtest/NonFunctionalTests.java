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
public class NonFunctionalTests {

    @Test
    public void incidentReportSpeedTest(){

        DesiredCapabilities dc = new DesiredCapabilities();

        dc.setCapability(MobileCapabilityType.DEVICE_NAME, "emulator-5554");
        dc.setCapability(MobileCapabilityType.PLATFORM_NAME, "android");
        dc.setCapability("appPackage", "com.example.locationtest");
        dc.setCapability("appActivity", ".MainActivity");
        int x = 300 + (int)(Math.random() * ((900 - 300) + 1));
        int y = 600 + (int)(Math.random() * ((1500 - 600) + 1));

        AndroidDriver<AndroidElement> driver = new AndroidDriver<AndroidElement>(dc);

        MobileElement el1 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el1.click();
        MobileElement el2 = (MobileElement) driver.findElementById("com.android.permissioncontroller:id/permission_allow_foreground_only_button");
        el2.click();
        MobileElement el3 = (MobileElement) driver.findElementById("com.example.locationtest:id/maps_button");
        el3.click();
        (new TouchAction(driver)).press(point(337, 718)).moveTo(point(772, 1148)).release().perform();

        (new TouchAction(driver)).press(point(831, 1456)).moveTo(point(352, 919)).release().perform();

        MobileElement element = (MobileElement) driver.findElementByAccessibilityId("You are here. ");
        (new TouchAction(driver)).longPress(point(element.getCenter())).waitAction().moveTo(point(x, y)).release().perform();

        MobileElement el4 = (MobileElement) driver.findElementById("com.example.locationtest:id/addIncidentButton");
        el4.click();
        MobileElement el5 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentTitleEntry");
        el5.sendKeys("TestIncident");
        MobileElement el6 = (MobileElement) driver.findElementById("com.example.locationtest:id/submitButton");
        el6.click();
        MobileElement el7 = (MobileElement) driver.findElementById("com.example.locationtest:id/incidentSeverityEntry");
        el7.click();
        MobileElement el8 = (MobileElement) driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ListView/android.widget.CheckedTextView[3]");
        el8.click();
        MobileElement el9 = (MobileElement) driver.findElementById("com.example.locationtest:id/submitButton");
        el9.click();
        MobileElement el10 = (MobileElement) driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout[2]");
        el10.click();
        MobileElement el11 = (MobileElement) driver.findElementByAccessibilityId("You are here. ");
        el11.click();


        (new TouchAction(driver)).press(point(337, 718)).moveTo(point(772, 1148)).release().perform();
        (new TouchAction(driver)).press(point(831, 1456)).moveTo(point(352, 919)).release().perform();

        MobileElement el12 = (MobileElement) driver.findElementByAccessibilityId("TestIncident (3). ");
        el12.click();

        Assert.assertEquals(el12.getCenter().x, x);
        Assert.assertEquals(el12.getCenter().y, y);


    }

}
