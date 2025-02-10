import React from "react";
import Header from "../components/Header";
import FooterComp from "../components/Footer";

const PageLayout = ({ title, children }) => {
    return (
        <>
            <Header />
            <div className="px-6 min-h-[100vh]">
                {title && (
                    <h1 className="text-2xl md:text-4xl font-extrabold text-center text-white-800 py-4">
                        {title}
                    </h1>
                )}
                {children}
            </div>
            <FooterComp />
        </>
    );
};

export default PageLayout;
