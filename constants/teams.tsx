export interface TeamProps {
  name: string;
  score: number;
  teammates: Array<string>;
}

export const teams: Array<TeamProps> = [
  {
    name: "Íkornarnir",
    score: 0,
    teammates: ["Freyja", "Helga", "Agnes", "Eyþór"],
  },
  {
    name: "Gíraffarnir",
    score: 0,
    teammates: ["Ómar", "Klara", "Hrafn", "Gunnhildur"],
  },
  {
    name: "Kindurnar",
    score: 0,
    teammates: ["Hanna", "Davíð", "Berglind", "Guðný"],
  },
];
