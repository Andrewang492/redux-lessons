import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <>
            <Header />
            <main className="App">
                <Outlet />
                {/* If we put this Layout component, we can represent all children */}
            </main>
        </>
    )
}

export default Layout