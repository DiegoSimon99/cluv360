const WebLayout = ({ children }) => {
    return (
        <div style={{"text-align":"center"}}>
            <header>Web Header</header>
            <main>{children}</main>
            <footer>Web Footer</footer>
        </div>
    );
};

export default WebLayout;
