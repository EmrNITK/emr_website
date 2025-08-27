import React from "react";
import Header from "../components/Header";
import FooterComp from "../components/Footer";

const PageLayout = ({ title, children }) => {
    return (
        <>
            <Header />
            <div className="min-h-[100vh]">
                {title && (
                    <div className="px-6 py-8">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-center text-white mb-4">
                            {title}
                        </h1>
                    </div>
                )}
                {children}
            </div>
            <FooterComp />
        </>
    );
};

export default PageLayout;
