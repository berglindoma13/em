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

interface GameProps {
  home: string;
  away: string;
  gameNumber: number;
}

const Checkbox = (props: any) => <input type="checkbox" {...props} />;
interface EverythingProps {
  teamId: number;
  teamName: string;
  teamIdentifierString: string;
}

const Everything: React.FC<EverythingProps> = ({
  teamName,
  teamId,
  teamIdentifierString,
}: EverythingProps) => {
  const [scoreChart, setScoreChart] = useState<Array<ScoreProps>>([]);
  const [scorePlot, setScorePlot] = useState<Array<DataPlotProps>>([]);
  const [checkedChallenges, setCheckedChallenges] = useState<
    Array<ChallengeProps>
  >([]);
  const [games, setGames] = useState<Array<GameProps>>([]);
  const [betFinished, setBetFinished] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScoreboard();
    getChallenges();
    getGames();
    getBets();
  }, []);

  async function getScoreboard() {
    const { data } = await supabase.from("scoreboard").select();
    const scoreboard = data as Array<ScoreProps>;
    setScoreChart(scoreboard as Array<ScoreProps>);
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

  const updateScoreboard = async (add: boolean) => {
    const previousScore = scoreChart.find(
      (x) => x.teamname === teamName
    )?.score;
    if (previousScore !== undefined) {
      const { error } = await supabase
        .from("scoreboard")
        .update({ score: add ? previousScore + 1 : previousScore - 1 })
        .eq("id", teamId);
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
    setLoading(false);
  }

  const checkboxUpdate = async (challenge: ChallengeProps) => {
    let challengeItem = false;
    if (teamId === 1) {
      challengeItem = !challenge.team1;
    }
    if (teamId === 2) {
      challengeItem = !challenge.team2;
    }
    if (teamId === 3) {
      challengeItem = !challenge.team3;
    }
    const toAdd: boolean = challengeItem;

    const { error } = await supabase
      .from("challenges")
      .update({ [teamIdentifierString]: challengeItem })
      .eq("id", challenge.id);

    getChallenges();
    updateScoreboard(toAdd);
  };

  const getGames = async () => {
    const { data } = await supabase.from("games").select();
    const games = data as Array<GameProps>;
    setGames(
      games.sort((x, y) => {
        if (x.gameNumber > y.gameNumber) return 1;
        else return -1;
      })
    );
  };

  const getBets = async () => {
    const { data } = await supabase.from("bets").select();
    const betFound = data?.find((x) => x.teamId === teamId);
    setBetFinished(betFound);
  };

  const betSubmit = async () => {
    /*@ts-ignore*/
    let game1home = document.getElementById("1-home").value;
    /*@ts-ignore*/
    let game1away = document.getElementById("1-away").value;
    /*@ts-ignore*/
    let game2home = document.getElementById("2-home").value;
    /*@ts-ignore*/
    let game2away = document.getElementById("2-away").value;
    /*@ts-ignore*/
    let game3home = document.getElementById("3-home").value;
    /*@ts-ignore*/
    let game3away = document.getElementById("3-away").value;
    /*@ts-ignore*/
    let game4home = document.getElementById("4-home").value;
    /*@ts-ignore*/
    let game4away = document.getElementById("4-away").value;
    /*@ts-ignore*/
    let game5home = document.getElementById("5-home").value;
    /*@ts-ignore*/
    let game5away = document.getElementById("5-away").value;
    /*@ts-ignore*/
    let game6home = document.getElementById("6-home").value;
    /*@ts-ignore*/
    let game6away = document.getElementById("6-away").value;

    const { data, error } = await supabase
      .from("bets")
      .insert([
        {
          game1_home: game1home,
          game1_away: game1away,
          game2_home: game2home,
          game2_away: game2away,
          game3_home: game3home,
          game3_away: game3away,
          game4_home: game4home,
          game4_away: game4away,
          game5_home: game5home,
          game5_away: game5away,
          game6_home: game6home,
          game6_away: game6away,
          teamId: teamId,
        },
      ])
      .select();

    console.log("error", error);
  };

  return (
    <PageWrapper>
      {/* <BackgroundImage src="/chris-robert-8Pmlah3Pkhg-unsplash.jpg"></BackgroundImage> */}
      <Page>
        <TeamOverOverview>
          <TeamOverview>
            <TeamTitle>{teamName}</TeamTitle>
            <TeamTeammates>
              {teams
                .filter((x) => x.name === teamName)[0]
                .teammates.map((teammate, index) => {
                  return <TeammateName key={index}>{teammate}</TeammateName>;
                })}
            </TeamTeammates>
          </TeamOverview>
          <CoolImage src="/gongugarpar.png"></CoolImage>
        </TeamOverOverview>
        <BetTitle>Áskorunarleikur göngugarpa</BetTitle>
        {checkedChallenges.map((challenge) => {
          let isChecked = false;
          if (teamId === 1) {
            isChecked = challenge.team1;
          }
          if (teamId === 2) {
            isChecked = challenge.team2;
          }
          if (teamId === 3) {
            isChecked = challenge.team3;
          }
          return (
            <ChallengeItem key={challenge.id}>
              <div>
                <label>
                  <Checkbox
                    checked={isChecked}
                    onChange={() => checkboxUpdate(challenge)}
                  />
                  <span>{challenge.title}</span>
                </label>
              </div>
            </ChallengeItem>
          );
        })}
        <PlotWrapper>
          <XYPlot
            height={500}
            width={300}
            //   animation={true}
            stackBy="y"
            xType="ordinal"
          >
            <XAxis />
            <YAxis
              tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickTotal={14}
            />
            <VerticalBarSeries
              data={scorePlot}
              barWidth={0.8}
              color="#00519d"
            />
          </XYPlot>
        </PlotWrapper>
        <BetTitle>Veðmál C riðils</BetTitle>

        {!betFinished &&
          games.map((game, index) => {
            return (
              <BetItemWrapper key={index}>
                <BetItem>
                  <BetItemName>{game.home}</BetItemName>
                  <BetItemInput
                    type="number"
                    id={`${game.gameNumber}-home`}
                  ></BetItemInput>
                </BetItem>
                <BetItem>
                  <BetItemInput
                    type="number"
                    id={`${game.gameNumber}-away`}
                  ></BetItemInput>
                  <BetItemName>{game.away}</BetItemName>
                </BetItem>
              </BetItemWrapper>
            );
          })}
        {!betFinished && (
          <div>
            <BetItemInfo>
              Bara hægt að senda inn einu sinni, verður að skilast fyrir byrjun
              fyrsta leiks!!!!!!!
            </BetItemInfo>
            <BetItemButton onClick={() => betSubmit()}>
              Senda veðmál
            </BetItemButton>
          </div>
        )}
        {betFinished && (
          <BetItemInfo>Veðmáli hefur verið skilað inn</BetItemInfo>
        )}
      </Page>
    </PageWrapper>
  );
};

export default Everything;

const CoolImage = styled.img`
  width: 200px;
  object-fit: cover;
`;

const TeamOverOverview = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PlotWrapper = styled.div`
  margin-top: 40px;
`;

const BetItemWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const BetItemName = styled.p``;
const BetItemInfo = styled.p``;

const BetItem = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5px;
`;

const BetItemInput = styled.input`
  width: 50px;
  height: 40px;
`;

const BetItemButton = styled.div`
  height: 60px;
  width: 50%;
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const BetTitle = styled.p`
  font-size: 30px;
  font-family: "Roboto", sans-serif;
`;

const PageWrapper = styled.div`
  position: relative;
  margin: -8px;
`;

const Page = styled.div`
  padding: 20px 40px;
`;

const TeamOverview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const TeamTitle = styled.h1`
  font-size: 45px;
  text-align: center;
  color: #00519d;
  font-family: "Roboto", sans-serif;
  margin-bottom: 5px;
`;

const TeamTeammates = styled.div`
  display: flex;
  flex-direction: row;
  color: #dd1832;
`;

const TeammateName = styled.p`
  font-size: 24px;
  text-align: center;
  margin-top: 5px;
  color: #bf4f74;
  padding-right: 5px;
  font-family: "Roboto", sans-serif;
`;

const ChallengeItem = styled.div`
    display;flex;
    flex-direction: row;
    margin-bottom:10px;
    font-size:18px;
`;
