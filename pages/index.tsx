import { useEffect, useState } from "react";
import styled from "styled-components";
import { TeamProps, teams } from "../constants/teams";
import { createClient } from "@supabase/supabase-js";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  VerticalBarSeries,
  XAxis,
  YAxis,
} from "react-vis";

const supabase = createClient(
  "https://zlvyxbdpvhvljjfkwdsi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsdnl4YmRwdmh2bGpqZmt3ZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMwMTgyNDAsImV4cCI6MjAxODU5NDI0MH0.-1C6KXuWMkl6ikCIaXibg8hvZ5tkgbFWZ9IXIwgBlso"
);

interface DataPlotProps {
  x: string;
  y: number;
}

interface ChallengeProps {
  title: string;
  team1: boolean;
  team2: boolean;
  team3: boolean;
  id: string;
}

interface ScoreProps {
  id: string;
  teamname: string;
  score: number;
}

const Checkbox = (props: any) => <input type="checkbox" {...props} />;

const Home: React.FC = () => {
  const [scoreChart, setScoreChart] = useState<Array<ScoreProps>>([]);
  const [scorePlot, setScorePlot] = useState<Array<DataPlotProps>>([]);
  const [checkedChallenges, setCheckedChallenges] = useState<
    Array<ChallengeProps>
  >([]);

  useEffect(() => {
    getScoreboard();
    getChallenges();
  }, []);

  async function getScoreboard() {
    const { data } = await supabase.from("scoreboard").select();
    const scoreboard = data as Array<ScoreProps>;
    setScoreChart(scoreboard as Array<ScoreProps>);
    console.log("scoreBoard", scoreboard);
    setScorePlot(
      scoreboard
        .sort((x, y) => {
          if (x.teamname > y.teamname) return 1;
          else return -1;
        })
        .map((item, index) => {
          return {
            x: item.teamname,
            y: item.score,
          };
        })
    );
  }

  const updateScoreboard = async (team: TeamProps, add: boolean) => {
    const id = team.name === "Lið 1" ? 1 : team.name === "Lið 2" ? 2 : 3;
    const previousScore = scoreChart.find(
      (x) => x.teamname === team.name
    )?.score;
    if (previousScore !== undefined) {
      const { error } = await supabase
        .from("scoreboard")
        .update({ score: add ? previousScore + 1 : previousScore - 1 })
        .eq("id", id);
      getScoreboard();
    }
  };

  async function getChallenges() {
    const { data } = await supabase.from("challenges").select();
    const challenges = data as Array<ChallengeProps>;
    setCheckedChallenges(
      challenges.sort((x, y) => {
        if (x.title > y.title) return 1;
        else return -1;
      }) as Array<ChallengeProps>
    );
  }

  const checkboxUpdate = async (challenge: ChallengeProps, team: TeamProps) => {
    let toAdd: boolean = false;
    if (team.name === "Lið 1") {
      toAdd = !challenge.team1;
    } else if (team.name === "Lið 2") {
      toAdd = !challenge.team2;
    } else if (team.name === "Lið 3") {
      toAdd = !challenge.team3;
    }

    if (team.name === "Lið 1") {
      const { error } = await supabase
        .from("challenges")
        .update({ team1: !challenge.team1 })
        .eq("id", challenge.id);
    } else if (team.name === "Lið 2") {
      const { error } = await supabase
        .from("challenges")
        .update({ team2: !challenge.team2 })
        .eq("id", challenge.id);
    } else if (team.name === "Lið 3") {
      const { error } = await supabase
        .from("challenges")
        .update({ team3: !challenge.team3 })
        .eq("id", challenge.id);
    }

    getChallenges();
    updateScoreboard(team, toAdd);
  };

  return (
    <div>
      {teams.map((team) => {
        return (
          <TeamOverview>
            <TeamTitle>{team.name}</TeamTitle>
            <TeamTeammates>
              {team.teammates.map((name) => (
                <TeammateName>{name}</TeammateName>
              ))}
              {checkedChallenges.map((challenge) => {
                return (
                  <ChallengeItem key={challenge.id}>
                    <div>
                      <label>
                        <Checkbox
                          checked={
                            (team.name === "Lið 1" && challenge.team1) ||
                            (team.name === "Lið 2" && challenge.team2) ||
                            (team.name === "Lið 3" && challenge.team3)
                          }
                          onChange={() => checkboxUpdate(challenge, team)}
                        />
                        <span>{challenge.title}</span>
                      </label>
                    </div>
                  </ChallengeItem>
                );
              })}
            </TeamTeammates>
          </TeamOverview>
        );
      })}

      <XYPlot
        height={300}
        width={300}
        animation={true}
        stackBy="y"
        xType="ordinal"
      >
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={scorePlot} barWidth={1} />
      </XYPlot>
    </div>
  );
};

export default Home;

const TeamOverview = styled.div`
    display:flex;
    flexDirection: row;
    justify-content: space-between';
    width:100%;
`;

const TeamTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
  font-family: "Roboto", sans-serif;
`;

const TeamTeammates = styled.div`
  margin-left: 20px;
  display: flex;
  flexdirection: column;
`;

const TeammateName = styled.p`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
  padding-right: 5px;
  font-family: "Roboto", sans-serif;
`;

const ChallengeItem = styled.div`
    display;flex;
    flex-direction: row;
    
`;
