export interface PlayerData {
  sid: string;
  name: string;
  clan_id: -1;
  clan_name: "";
  guest: false;
  team: number;
  title: "User";
  skill: 0;
  level: 1;
  premium: true;
  customization: {};
  type: "user";
  record: {
    kills: number;
    deaths: number;
    points: number;
  };
}
