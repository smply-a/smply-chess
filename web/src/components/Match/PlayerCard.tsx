import { Color } from "@/lib/Chess/types";
import Image from "next/image";

interface Props {
    id: number;
    name: string;
    pfp: string | null;
    color: Color
}

const PlayerCard = ({id, name, pfp, color}: Props) => {
    


    return (
        <section
            className="bg-red-50 text-black flex items-center justify-between"
        >
            {/* !!!!!!!!!!!!!!!!!!! todo make link to profile */}
            <div className="flex flex-1 items-center justify-start">
                <div
                    className="rounded-full size-10 bg-bg-surface overflow-hidden flex items-center justify-center"
                >
                    {pfp
                        ? <Image src={pfp} alt="pfp" fill></Image>
                        : <div className="text-text-muted">?</div>
                    }
                </div>
                <div className="flex flex-col justify-center items-start">
                    <span>{name}</span>
                    <div>Material</div>
                </div>

            </div>
            <div
                className=""
            >
                4:44
            </div>
        </section>
    )
}

export default PlayerCard