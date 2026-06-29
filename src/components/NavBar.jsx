import './style.css'

const NavBar = () => {

    return (
        <nav className='navbar'>
            <div className='left-side'>
                <a href='/' className='logo'> BLINK</a>
            </div>

            <div className='center-side'>
                <ul className='links'>
                    <li>
                        <a href='/'>home</a>
                    </li>
                    <li>
                        <a href='/blink'>Blink</a>
                    </li>
                    <li>
                        <a href='/settings'>Settings</a>
                    </li>
                    <li>
                        <a href='/stats'>statistics</a>
                    </li>
                    <li>
                        <a href='/timer'>Timer</a>
                    </li>
                    <li>
                        <a href='/test'>Test</a>
                    </li>
                </ul>
            </div>

            <div className='left-side'>
                <a href='/login' className='login-s'>login</a>
            </div>
        </nav>
    );
}

export default NavBar