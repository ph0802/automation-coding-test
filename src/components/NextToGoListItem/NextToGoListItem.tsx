import "./NextToGoListItem.css";
import { memo } from "react";
import { ListRace } from "../../types/racing";
import { CountdownTimer } from "../CountdownTimer/CountdownTimer";

type Props = { race: ListRace; itemIndex: number };

const _NextToGoListItem = ({ race, itemIndex }: Props): JSX.Element => {
  return (
    <div className="item">
      <div className="race-name">
        <b className="race-number">R{race.raceNumber}</b>
        <p data-testid={`meeting-name-${itemIndex}`}>{race.meetingName}</p>
      </div>
      <CountdownTimer
        advertisedStart={race.advertisedStart}
        itemIndex={itemIndex}
      />
    </div>
  );
};

export const NextToGoListItem = memo(_NextToGoListItem);
