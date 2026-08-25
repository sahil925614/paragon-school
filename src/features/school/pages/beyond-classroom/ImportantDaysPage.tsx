import { CalendarDays } from "lucide-react";
import { BeyondClassroomDetailLayout } from "./BeyondClassroomDetailLayout";
export function ImportantDaysPage() {
  const description = "Important national, international and commemorative days are observed through meaningful monthly themes and activities.";
  return <BeyondClassroomDetailLayout title="Important Days" description={description} icon={CalendarDays}><p>{description}</p><p>Assemblies, discussions and creative presentations help students understand the values connected with each occasion.</p></BeyondClassroomDetailLayout>;
}
