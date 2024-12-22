const donors = ["Alena"];

const milestones = [
  {
    date: "2024-11-29",
    emoji: "🚀",
    description: "Launched initial version with basic heatmap functionality.",
  },
  {
    date: "2024-11-30",
    emoji: "🌐",
    description:
      "Migrated to React and added support for multiple languages, including English, German, and Russian.",
  },
  {
    date: "2024-11-30",
    emoji: "📱",
    description: "Enhanced styles for better display on mobile devices.",
  },
  {
    date: "2024-12-09",
    emoji: "🎨",
    description:
      "Introduced customizable color palettes for personalized heatmap appearance.",
  },
  {
    date: "2024-12-17",
    emoji: "❄️",
    description:
      "Added festive elements like snowfall effect and Santa Claus hat for Christmas celebrations.",
  },
  {
    date: "2024-12-19",
    emoji: "⚡",
    description:
      "Integrated performance improvements for smoother user experience.",
  },
];

const DonationView = () => {
  return (
    <div className="donation-view__container">
      <p className="donation-view__header">
        Support the Heatmap Tracker Plugin 💖
      </p>
      <p className="donation-view__text">
        Hello! I'm the sole developer behind the Heatmap Tracker plugin. Your
        support enables me to continue improving and maintaining this tool for
        the Obsidian community. 🙏
      </p>
      <p className="donation-view__text">
        If you find this plugin useful, please consider making a donation to Buy
        Me a Coffee page. Your contribution is greatly appreciated! ☕
      </p>
      <a
        href="https://www.buymeacoffee.com/mrubanau"
        target="_blank"
        className="donation-view__button"
        aria-label="Donate now via Buy Me a Coffee"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ pointerEvents: "none" }}
        />
      </a>
      <p className="donation-view__sub-header">Development Milestones 🏆</p>
      <ul className="donation-view__milestone-list">
        {milestones.map((milestone, index) => (
          <li key={index} className="donation-view__milestone-item">
            <span className="donation-view__emoji">{milestone.emoji}</span>{" "}
            <strong>{milestone.date}</strong>: {milestone.description}
          </li>
        ))}
      </ul>
      <p className="donation-view__sub-header">
        Recent Donors 🎉 (this list is updated manually)
      </p>
      <ul className="donation-view__donor-list">
        {donors.map((donor, index) => (
          <li key={index} className="donation-view__donor-item">
            {donor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationView;
