import React from 'react';
import Navbar from './Navbar';

const HomePage = () => {
    return (
        <div>
            
            <h1>Welcome to the Homepage!</h1>
            <p>This is a basic homepage component.</p>

            <a href="/signin">Sign In</a>
            <a href="/signup">Sign Up</a>
        </div>
    );
};

export default HomePage;