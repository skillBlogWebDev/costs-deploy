import { useStore } from 'effector-react';
import { useTheme } from '../../hooks/index';
import { $auth, $userData } from '../../context/auth';
import { removeUser } from '../../utils/auth';
import './styles.css';

export const Header = () => {
    const { switchTheme, theme } = useTheme();
    const username = useStore($userData);
    const loggedIn = useStore($auth);

    const logout = () => {
        removeUser()
    }

    return (
        <header className={`navbar navbar-dark bg-${theme === 'dark' ? 'dark' : 'primary'}`}>
            <div className="container">
                <h1 style={{ color: 'white' }}>Costs App</h1>
                {username.length ? <h2 style={{ color: 'white' }}>{username}</h2> : ''}
                <button
                    onClick={switchTheme}
                    className={`btn btn-${theme === 'dark' ? 'light' : 'dark'}`}
                >
                    {theme === 'dark' ? 'Go light' : 'Go dark'}
                </button>
                {loggedIn && <button onClick={logout} className='btn btn-primary'>Logout</button>}
            </div>
        </header>
    );
}