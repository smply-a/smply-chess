import NavButton from "./NavButton"

const Nav = () => {

    return (
        <header
            className="sticky top-0 flex justify-between items-center z-100
            py-3 px-2"
        >   
            <div className="flex-1 flex justify-start">a</div>
            <nav className="flex items-center justify-center gap-3">
                <NavButton href="/play/bot">bot</NavButton>
                <NavButton href="/play/lobby">lobby</NavButton>
                <NavButton href="/play">locale</NavButton>
            </nav>
            <div className="flex-1 flex justify-end">A</div>

        </header>)
        
}

export default Nav