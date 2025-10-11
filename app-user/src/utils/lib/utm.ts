import AsyncStorage from "@react-native-async-storage/async-storage";

type UTM = Partial<{
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}>;

export async function saveUtmFromUrl(url?: string) {
  if (!url) return;
  const q = new URL(url).searchParams;
  const utm: UTM = {
    source: q.get("utm_source") || undefined,
    medium: q.get("utm_medium") || undefined,
    campaign: q.get("utm_campaign") || undefined,
    term: q.get("utm_term") || undefined,
    content: q.get("utm_content") || undefined,
  };
  if (Object.values(utm).some(Boolean)) {
    await AsyncStorage.setItem("utm", JSON.stringify(utm));
  }
}

async function getUtm(): Promise<UTM | undefined> {
  const raw = await AsyncStorage.getItem("utm");
  return raw ? (JSON.parse(raw) as UTM) : undefined;
}
