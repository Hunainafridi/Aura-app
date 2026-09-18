import WidgetKit
import SwiftUI

// Aura iOS WidgetKit Extension
// Enables 1-Tap Voice Purge and 30s Panic Reset directly from iOS Home Screen & Lock Screen

struct AuraWidgetEntry: TimelineEntry {
    let date: Date
    let clarityScore: Int
    let nocturnalWorriesResolvedPct: Int
    let pendingMorningDeliberations: Int
}

struct AuraWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> AuraWidgetEntry {
        AuraWidgetEntry(date: Date(), clarityScore: 94, nocturnalWorriesResolvedPct: 82, pendingMorningDeliberations: 1)
    }

    func getSnapshot(in context: Context, completion: @escaping (AuraWidgetEntry) -> Void) {
        let entry = AuraWidgetEntry(date: Date(), clarityScore: 94, nocturnalWorriesResolvedPct: 82, pendingMorningDeliberations: 1)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<AuraWidgetEntry>) -> Void) {
        let currentDate = Date()
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 30, to: currentDate)!
        let entry = AuraWidgetEntry(date: currentDate, clarityScore: 94, nocturnalWorriesResolvedPct: 82, pendingMorningDeliberations: 0)
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        completion(timeline)
    }
}

struct AuraWidgetEntryView: View {
    var entry: AuraWidgetProvider.Entry

    var body: some View {
        ZStack {
            Color(red: 0.04, green: 0.04, blue: 0.06)
                .edgesIgnoringSafeArea(.all)

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("AURA")
                        .font(.system(size: 11, weight: .black, design: .monospaced))
                        .foregroundColor(.cyan)
                    Spacer()
                    Circle()
                        .fill(Color.cyan)
                        .frame(width: 6, height: 6)
                        .shadow(color: .cyan, radius: 4)
                }

                Spacer()

                Text("\(entry.nocturnalWorriesResolvedPct)%")
                    .font(.system(size: 26, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("Dissolved by morning")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(.gray)

                HStack(spacing: 6) {
                    // Deep link to Voice Purge
                    Link(destination: URL(string: "aura://voice-purge")!) {
                        HStack {
                            Image(systemName: "mic.fill")
                                .font(.system(size: 9))
                            Text("Purge")
                                .font(.system(size: 9, weight: .bold))
                        }
                        .padding(.vertical, 4)
                        .padding(.horizontal, 8)
                        .background(Color.cyan.opacity(0.2))
                        .foregroundColor(.cyan)
                        .cornerRadius(12)
                    }

                    // Deep link to SOS Panic Reset
                    Link(destination: URL(string: "aura://panic-reset")!) {
                        HStack {
                            Image(systemName: "wind")
                                .font(.system(size: 9))
                            Text("SOS")
                                .font(.system(size: 9, weight: .bold))
                        }
                        .padding(.vertical, 4)
                        .padding(.horizontal, 8)
                        .background(Color.red.opacity(0.2))
                        .foregroundColor(.red)
                        .cornerRadius(12)
                    }
                }
            }
            .padding(12)
        }
    }
}

@main
struct AuraWidget: Widget {
    let kind: String = "AuraWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: AuraWidgetProvider()) { entry in
            AuraWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Aura Quick Sanctuary")
        .description("1-Tap Voice Purge into Vapor and 30-Second Panic Sensory Reset.")
        .supportedFamilies([.systemSmall, .accessoryCircular, .accessoryRectangular])
    }
}
