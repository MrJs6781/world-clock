export interface Timezone {
  id: string;
  name: string;
  countryCode: string;
  offset: number;
  formattedName: string;
}

export interface OptimalPostingTimeResult {
  time: string;
  coverage: number;
}
