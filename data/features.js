import { Brain, Activity, Stethoscope, History } from "lucide-react";

export const features = [
  {
    title: "MRI XAI",
    description:
      "Upload MRI images and review prediction results together with heatmap-based explainability.",
    href: "/mri",
    icon: Brain,
    accent: "from-blue-500/20 to-cyan-500/10",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
  {
    title: "EEG XAI",
    description:
      "Analyze EEG signals and inspect the most influential segments that affected model decisions.",
    href: "/eeg",
    icon: Activity,
    accent: "from-purple-500/20 to-fuchsia-500/10",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
  {
    title: "Multimodal Diagnosis",
    description:
      "Combine MRI and EEG results using late fusion for multimodal stroke diagnosis.",
    href: "/multimodal",
    icon: Stethoscope,
    accent: "from-emerald-500/20 to-green-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    title: "History",
    description:
      "Review saved multimodal analysis results from the PostgreSQL database.",
    href: "/history",
    icon: History,
    accent: "from-orange-500/20 to-yellow-500/10",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
  },
];
