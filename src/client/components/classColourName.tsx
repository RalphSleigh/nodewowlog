import React, {FC} from "react";
import {CreatureFieldsFragment} from "../queries/types";

export const ClassColourName: FC<{ creature: CreatureFieldsFragment }> = ({creature, children}) => {
    switch (creature.__typename) {
        case "Player":
            return <span className={`classColour${creature.specClassInfo.classID}`} >{children}</span>
        default:
            return <>{children}</>
    }
}
