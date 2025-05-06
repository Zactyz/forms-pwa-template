import { JSXElementConstructor, ReactElement, useState } from "react";
import type { NextPageWithLayout } from "./_app";
import { getLayout } from "@/lib/homeLayout";
import Link from "next/link";

const Home: NextPageWithLayout = () => {
    const [isComplete, setIsComplete] = useState(false);
    const cacheContent = async () => {
        const res = await window.serwist.messageSW({ action: "a-cool-action" });
        setIsComplete(res);
    };

    return (
        <div
            className={`
        flex flex-col items-center
        justify-center
      `}
        >
            <div className="prose w-full max-w-full sm:w-[80%] sm:max-w-4xl my-2">
                <h1 className="text-center">ISW Forms</h1>
                <div className="text-center mb-8">
                    <p>A powerful mobile form solution for data collection</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Fill Out Forms</h2>
                            <p>Complete forms and submit data from any device, even offline.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link href="/forms" className="btn btn-primary">
                                    View Forms
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Form Builder</h2>
                            <p>Create and manage customized form templates with our drag-and-drop builder.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link href="/admin/form-builder" className="btn btn-primary">
                                    Build Forms
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h2>Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">Offline Support</h3>
                                <p>Fill out forms even without an internet connection. Data syncs when you're back online.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">Mobile Friendly</h3>
                                <p>Responsive design works on any device - desktop, tablet, or smartphone.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">Custom Fields</h3>
                                <p>Create forms with a variety of field types including text, dropdowns, checkboxes, and file uploads.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button className="btn btn-primary shadow-lg" tabIndex={0} onClick={cacheContent}>
                        {isComplete ? "Downloaded for Offline Use" : "Download for Offline Use"}
                    </button>
                </div>
            </div>
        </div>
    );
};

Home.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Home");

export default Home;
