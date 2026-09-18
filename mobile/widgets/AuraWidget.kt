package com.auraclarity.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle

/**
 * Aura Android Glance Home Screen & Lock Screen Widget.
 * Offers 1-Tap Zero-Effort Voice Purge and 30s SOS Sensory Panic Reset.
 */
class AuraGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                AuraWidgetContent()
            }
        }
    }

    @Composable
    private fun AuraWidgetContent() {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(Color(0xFF090A0F))
                .padding(12.dp),
            verticalAlignment = Alignment.Vertical.CenterVertically,
            horizontalAlignment = Alignment.Horizontal.CenterHorizontally
        ) {
            Text(
                text = "AURA",
                style = TextStyle(
                    color = Color(0xFF4CD7F6),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            )

            Spacer(modifier = GlanceModifier.height(4.dp))

            Text(
                text = "82%",
                style = TextStyle(
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
            )

            Text(
                text = "Worries dissolved by morning",
                style = TextStyle(
                    color = Color(0xFF94A3B8),
                    fontSize = 9.sp
                )
            )

            Spacer(modifier = GlanceModifier.height(8.dp))

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Horizontal.CenterHorizontally
            ) {
                // 1-Tap Voice Purge Trigger
                Box(
                    modifier = GlanceModifier
                        .background(Color(0xFF1E293B))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "🎤 Voice Purge",
                        style = TextStyle(color = Color(0xFF38BDF8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    )
                }

                Spacer(modifier = GlanceModifier.width(6.dp))

                // SOS 30s Panic Reset Trigger
                Box(
                    modifier = GlanceModifier
                        .background(Color(0xFF3B1D28))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "⚡ 30s SOS",
                        style = TextStyle(color = Color(0xFFFDA4AF), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
    }
}

class AuraGlanceReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = AuraGlanceWidget()
}
