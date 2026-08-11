import { Color } from "@/lib/Chess/types"

const Clock = ({color}: {color: Color}) => {

    const time = "KYS"

    const formatedTime = time

    return (<div className="flex items-center justify-center p-1">
        {formatedTime}
    </div>)
}

export default Clock