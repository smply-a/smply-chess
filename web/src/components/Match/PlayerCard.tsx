"use client"

import { materialValue } from "@/lib/Chess/board";
import { Color } from "@/lib/Chess/types";
import Image from "next/image";
import { useChessState } from "../chess/ChessProvider";
import Clock from "./Clock";
import { usePreferences } from "./PreferencesProvider";

interface Props {
    id: number; // für link zu profil
    name: string;
    pfp: string | null;
    bottom?: boolean
}

const PlayerCard = ({id, name, pfp, bottom = false}: Props) => {
    const {capturedMaterial} = useChessState()
    const {orientation} = usePreferences()

    const color = bottom
        ? orientation 
        : orientation === Color.White ? Color.Black : Color.White

    const opponentColor = !bottom
        ? orientation 
        : orientation === Color.White ? Color.Black : Color.White

    const materialAdvantage = Math.max(0, materialValue(capturedMaterial[color])-materialValue(capturedMaterial[opponentColor]))

    // TODO siehe unten wegen link zu profil
    return (
        <section
            className="bg-red-50 text-black flex items-center justify-between h-12"
        >
            {/* !!!!!!!!!!!!!!!!!!! todo make link to profile */}
            <div className="flex items-center justify-start p-1 gap-2 cursor-pointer">
                <div
                    className="relative rounded-full size-10 bg-bg-surface overflow-hidden flex items-center justify-center"
                >
                    {pfp
                        ? <Image src={pfp} alt="pfp" fill></Image>
                        : <div className="text-text-muted">?</div>
                    }
                </div>
                <div className="flex flex-col justify-start items-start leading-tight">
                    <span>{name}</span>
                    <div className="flex justify-between items-center gap-1 min-h-5">
                        <span>{capturedMaterial[color]}</span>
                        {materialAdvantage > 0 && 
                            <span>+{materialAdvantage}</span>}
                    </div>
                </div>
            </div>

            <div
                className="p-1"
            >
                <Clock color={color}/>
            </div>
        </section>
    )
}

export default PlayerCard