import { memo } from "react";
import { ListRace } from "../types/racing";
import { NextToGoListItem } from "./NextToGoListItem/NextToGoListItem";

type Props = { races: ListRace[] };

const _NextToGoList = ({ races }: Props): JSX.Element => {
  return (
    <div>
      {races.map((race, index) => (
        <NextToGoListItem key={race.raceId} race={race} itemIndex={index} />
      ))}
    </div>
  );
};

export const NextToGoList = memo(_NextToGoList);
