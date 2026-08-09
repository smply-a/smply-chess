interface Props {
    onReset?: () => void; 
}

// todo
const MatchEndOverlay = ({ onReset }: Props) => {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            
            <div className="bg-red-500 w-[50%] h-[50%] p-[5%] 
                rounded-2xl shadow-2xl flex flex-col items-center justify-between text-center"
            >
                
                <h2 className=" font-bold text-white">
                    Match End
                </h2>
                
                <button 
                
                >
                    Rematch
                </button>
            </div>
        </div>
    );
};

export default MatchEndOverlay;