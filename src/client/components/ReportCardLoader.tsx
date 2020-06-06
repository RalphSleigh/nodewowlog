import React, {FC} from "react";
import {useQuery} from "@apollo/client";
import {EncounterInfoQuery, EncounterInfoQueryVariables} from "../queries/types";
import {ENCOUNTER_INFO} from "../queries/encounter";
import {WrathionReportCard} from "./reportCards/wrathion";


export const ReportCardLoader: FC<{encounterId: number; live: boolean}> = ({encounterId, live}) => {
    const {loading, error, data} = useQuery<EncounterInfoQuery, EncounterInfoQueryVariables>(ENCOUNTER_INFO, {
        variables: {id: encounterId},
        //pollInterval: live ? 1000 : 0
    });
    if (loading) return <>Loading</>
    if (!data) {
        return <>{`Error: ${error}`} </>
    }

    switch (data.Encounter.name) {
        case "Wrathion":
            return <WrathionReportCard encounter={data.Encounter} live={live}/>
        default:
            return <p>Currently only supported for Wrathion</p>
    }
}