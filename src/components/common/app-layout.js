const Navigation = () => {
    return (
        <header className="z-10 fixed top-0 left-0 w-full py-3 text-slate-100 bg-slate-800 dark:bg-slate-900">
            <div className="flex max-w-5xl w-full mx-auto">
                <div className="w-full flex justify-center">
                    {/* <span className="font-mono text-xl font-bold">
                        Babydrop
                    </span> */}
                    <img
                        className="w-auto h-6 -ml-1"
                        src="/favicon.png"
                        alt="App logo"
                    />
                </div>
            </div>
        </header>
    );
};

const AppLayout = ({ children }) => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-3 lg:px-24 py-8">
            <div className="z-10 max-w-5xl w-full text-sm pt-10">
                <Navigation />
                {children}
            </div>
        </main>
    )
}

export default AppLayout