export interface TeamProps {
  name: string;
  score: number;
  teammates: Array<string>;
}

export const teams: Array<TeamProps> = [
  {
    name: "Lið 1",
    score: 0,
    teammates: ["Freyja", "Helga", "Hrafn", "Ómar"],
  },
  {
    name: "Lið 2",
    score: 0,
    teammates: ["Davíð", "Klara", "Agnes", "Gunnhildur"],
  },
  {
    name: "Lið 3",
    score: 0,
    teammates: ["Hanna", "Eyþór", "Berglind", "Guðný"],
  },
];
