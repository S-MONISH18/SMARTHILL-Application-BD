package com.apphill

import android.os.Bundle
import android.view.WindowManager
import android.os.Handler
import android.os.Looper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  private val handler = Handler(Looper.getMainLooper())

  private val clearSecureFlagRunnable = object : Runnable {
    override fun run() {
      // 🔥 force remove secure flag repeatedly
      window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
      handler.postDelayed(this, 500)
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)

    // start loop
    handler.post(clearSecureFlagRunnable)
  }

  override fun onDestroy() {
    super.onDestroy()
    handler.removeCallbacks(clearSecureFlagRunnable)
  }

  override fun getMainComponentName(): String = "apphill"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}