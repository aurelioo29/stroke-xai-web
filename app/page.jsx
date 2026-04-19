import PageHeader from "@/components/shared/PageHeader";
import FeatureCard from "@/components/home/FeatureCard";
import { features } from "@/data/features";

export default function HomePage() {
  return (
    <>
      <PageHeader
        badge="Stroke XAI Platform"
        title="Multimodal Stroke Diagnosis System"
        description="Web-based system for stroke diagnosis using MRI and EEG data, enhanced with Explainable AI to improve prediction transparency."
      />

      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </>
  );
}
