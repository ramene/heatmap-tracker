import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { Entry, Box } from "src/types";
import { formatDateToISO8601 } from "src/utils/date";
import { processCustomMetrics } from "src/utils/statistics";

interface StatisticsMetricProps {
  label: string;
  value: number | string;
}

interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  currentStreakStartDate: Date | null;
  currentStreakEndDate: Date | null;
  longestStreakStartDate: Date | null;
  longestStreakEndDate: Date | null;
}

function calculateStreaks(entries: Entry[]): StreakResult {
  if (entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStartDate: null,
      currentStreakEndDate: null,
      longestStreakStartDate: null,
      longestStreakEndDate: null,
    };
  }

  const sortedEntries = entries
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 1;
  let longestStreak = 1;

  let currentStreakStartDate: Date | null = new Date(sortedEntries[0].date);
  let currentStreakEndDate: Date | null = new Date(sortedEntries[0].date);

  let longestStreakStartDate = new Date(sortedEntries[0].date);
  let longestStreakEndDate = new Date(sortedEntries[0].date);

  let tempStreakStartDate = new Date(sortedEntries[0].date);

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date);
    const currDate = new Date(sortedEntries[i].date);

    const diffDays =
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
      tempStreakStartDate = currDate;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      longestStreakStartDate = tempStreakStartDate;
      longestStreakEndDate = currDate;
    }

    currentStreakEndDate = currDate;
  }

  const today = new Date();
  const lastEntryDate = new Date(sortedEntries[sortedEntries.length - 1].date);
  const diffWithToday = Math.abs(
    (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffWithToday > 1) {
    currentStreak = 0;
    currentStreakStartDate = null;
    currentStreakEndDate = null;
  }

  return {
    currentStreak,
    longestStreak,
    currentStreakStartDate,
    currentStreakEndDate,
    longestStreakStartDate,
    longestStreakEndDate,
  };
}

interface MultiChannelStats {
  totalMultiChannelDays: number;
  totalDocuments: number;
  averageCoverage: number;
  topChannels: Array<{ channel: string; count: number }>;
  channelDiversity: number;
  multiDocumentDays: number;
  highIntensityDays: number;
}

function calculateMultiChannelStats(boxes: Box[]): MultiChannelStats {
  const multiChannelBoxes = boxes.filter(box => 
    box.metadata && box.metadata.documentCount && box.metadata.documentCount > 0
  );

  if (multiChannelBoxes.length === 0) {
    return {
      totalMultiChannelDays: 0,
      totalDocuments: 0,
      averageCoverage: 0,
      topChannels: [],
      channelDiversity: 0,
      multiDocumentDays: 0,
      highIntensityDays: 0,
    };
  }

  // Calculate totals
  const totalDocuments = multiChannelBoxes.reduce((sum, box) => 
    sum + (box.metadata?.documentCount || 0), 0
  );

  // Calculate coverage statistics
  const coveragePercentages = multiChannelBoxes
    .filter(box => box.metadata?.channels)
    .map(box => Math.round(((box.metadata?.channels?.length || 0) / 6) * 100));
  
  const averageCoverage = coveragePercentages.length > 0 
    ? Math.round(coveragePercentages.reduce((sum, coverage) => sum + coverage, 0) / coveragePercentages.length)
    : 0;

  // Count channel usage
  const channelCounts: Record<string, number> = {};
  multiChannelBoxes.forEach(box => {
    if (box.metadata?.channels) {
      box.metadata.channels.forEach(channel => {
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      });
    }
  });

  const topChannels = Object.entries(channelCounts)
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Calculate diversity and intensity metrics
  const uniqueChannels = Object.keys(channelCounts).length;
  const channelDiversity = Math.round((uniqueChannels / 6) * 100);
  
  const multiDocumentDays = multiChannelBoxes.filter(box => 
    (box.metadata?.documentCount || 0) > 1
  ).length;
  
  const highIntensityDays = multiChannelBoxes.filter(box => {
    const docCount = box.metadata?.documentCount || 0;
    const channelCount = box.metadata?.channels?.length || 0;
    const intensity = docCount * (1 + (channelCount * 0.5));
    return intensity >= 5; // High intensity threshold
  }).length;

  return {
    totalMultiChannelDays: multiChannelBoxes.length,
    totalDocuments,
    averageCoverage,
    topChannels,
    channelDiversity,
    multiDocumentDays,
    highIntensityDays,
  };
}

function StatisticsMetric({ label, value }: StatisticsMetricProps) {
  return (
    <div className="stats-metric">
      <span className="stats-label">{label}</span>
      <span className="stats-value">{value}</span>
    </div>
  );
}

function StatisticsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <h3 className="stats-card-title">{title}</h3>
      </div>
      <div className="stats-card-content">
        {children}
      </div>
    </div>
  );
}

function StatisticsView() {
  const { t } = useTranslation();
  const { 
    entriesWithIntensity, 
    trackerData, 
    boxes, 
    statisticsStaleWarning, 
    clearStaleWarning,
    triggerRefresh 
  } = useHeatmapContext();

  const {
    currentStreak,
    longestStreak,
    longestStreakEndDate,
    longestStreakStartDate,
    currentStreakStartDate,
    currentStreakEndDate,
  } = useMemo(
    () => calculateStreaks(trackerData.entries),
    [trackerData.entries]
  );

  const currentStreakValue = useMemo(() => {
    if (!currentStreakStartDate || !currentStreakEndDate) {
      return `${currentStreak}`;
    }

    return `${currentStreak} (${
      formatDateToISO8601(currentStreakStartDate) ?? ""
    } - ${formatDateToISO8601(currentStreakEndDate) ?? ""})`;
  }, [currentStreak, currentStreakStartDate, currentStreakEndDate]);

  const longestStreakValue = useMemo(() => {
    if (!longestStreakStartDate || !longestStreakEndDate) {
      return `${longestStreak}`;
    }

    return `${longestStreak} (${
      formatDateToISO8601(longestStreakStartDate) ?? ""
    } - ${formatDateToISO8601(longestStreakEndDate) ?? ""})`;
  }, [longestStreak, longestStreakStartDate, longestStreakEndDate]);

  const userInsights = useMemo(
    () =>
      processCustomMetrics(
        trackerData.insights,
        Object.values(entriesWithIntensity)
      ),
    [trackerData.insights, entriesWithIntensity]
  );

  const multiChannelStats = useMemo(
    () => calculateMultiChannelStats(boxes),
    [boxes]
  );

  return (
    <div className="heatmap-statistics">
      {/* Staleness Warning Banner */}
      {statisticsStaleWarning && (
        <div className="stats-staleness-banner">
          <div className="staleness-content">
            <span className="staleness-icon">⚠️</span>
            <div className="staleness-message">
              <strong>Statistics May Be Outdated</strong>
              <p>{statisticsStaleWarning}</p>
            </div>
            <div className="staleness-actions">
              <button 
                className="refresh-page-btn"
                onClick={() => window.location.reload()}
                title="Refresh page to see latest data"
              >
                🔄 Refresh Page
              </button>
              <button 
                className="dismiss-btn"
                onClick={clearStaleWarning}
                title="Dismiss this warning"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="stats-grid">
        {/* Overview Card */}
        <StatisticsCard title="📊 Overview">
          <StatisticsMetric
            label={t("statistics.totalTrackingDaysThisYear")}
            value={Object.keys(entriesWithIntensity).length}
          />
          <StatisticsMetric
            label={t("statistics.totalTrackingDays")}
            value={Object.keys(trackerData.entries).length}
          />
        </StatisticsCard>

        {/* Streaks Card */}
        <StatisticsCard title="🔥 Streaks">
          <StatisticsMetric
            label={t("statistics.currentStreak")}
            value={currentStreakValue}
          />
          <StatisticsMetric
            label={t("statistics.longestStreak")}
            value={longestStreakValue}
          />
        </StatisticsCard>

        {/* Multi-Channel Publishing Card */}
        {multiChannelStats.totalMultiChannelDays > 0 && (
          <StatisticsCard title="📱 Publishing Metrics">
            <StatisticsMetric
              label="Multi-Channel Days"
              value={multiChannelStats.totalMultiChannelDays}
            />
            <StatisticsMetric
              label="Total Documents"
              value={multiChannelStats.totalDocuments}
            />
            <StatisticsMetric
              label="Average Coverage"
              value={`${multiChannelStats.averageCoverage}%`}
            />
            <StatisticsMetric
              label="Channel Diversity"
              value={`${multiChannelStats.channelDiversity}%`}
            />
            <StatisticsMetric
              label="High Intensity Days"
              value={multiChannelStats.highIntensityDays}
            />
            <StatisticsMetric
              label="Publishing Efficiency"
              value={`${Math.round((multiChannelStats.totalDocuments / Math.max(multiChannelStats.totalMultiChannelDays, 1)) * 100) / 100} docs/day`}
            />
          </StatisticsCard>
        )}

        {/* Social Channels Card */}
        {multiChannelStats.topChannels.length > 0 && (
          <StatisticsCard title="🌍 Social Channels">
            {multiChannelStats.topChannels.map(({ channel, count }) => {
              const channelEmojis = {
                twitter: "🐦",
                instagram: "📸", 
                linkedin: "💼",
                tiktok: "🎬",
                facebook: "👥",
                substack: "📝"
              };
              const emoji = channelEmojis[channel as keyof typeof channelEmojis] || "📱";
              return (
                <StatisticsMetric
                  key={channel}
                  label={`${emoji} ${channel.charAt(0).toUpperCase() + channel.slice(1)}`}
                  value={`${count} posts`}
                />
              );
            })}
            <div className="stats-highlight">
              <StatisticsMetric
                label="🏆 Most Active"
                value={multiChannelStats.topChannels[0]?.channel || 'None'}
              />
            </div>
          </StatisticsCard>
        )}

        {/* Custom Insights Card */}
        {Object.entries(userInsights).length > 0 && (
          <StatisticsCard title="💡 Insights">
            {Object.entries(userInsights).map(([key, value]) => (
              <StatisticsMetric key={key} label={key} value={value} />
            ))}
          </StatisticsCard>
        )}
      </div>
    </div>
  );
}

export default StatisticsView;
