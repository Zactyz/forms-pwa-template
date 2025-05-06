import { JSXElementConstructor, ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { getLayout } from "@/lib/homeLayout";
import Link from "next/link";

const AdminSettingsPage: NextPageWithLayout = () => {
    const [activeTab, setActiveTab] = useState<string>('general');

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Settings</h1>
            </div>

            <div className="tabs mb-4">
                <a
                    className={`tab tab-bordered ${activeTab === 'general' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </a>
                <a
                    className={`tab tab-bordered ${activeTab === 'destinations' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('destinations')}
                >
                    Form Destinations
                </a>
                <a
                    className={`tab tab-bordered ${activeTab === 'sync' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('sync')}
                >
                    Sync Configuration
                </a>
            </div>

            {activeTab === 'general' && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">General Settings</h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Configure general application settings.
                        </p>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Application Name</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                placeholder="ISW Forms"
                                defaultValue="ISW Forms"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Default Theme</span>
                            </label>
                            <select className="select select-bordered w-full">
                                <option value="iswLight">Light</option>
                                <option value="iswDark">Dark</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Enable Offline Mode</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'destinations' && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Form Destinations</h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Configure where form submissions are sent when submitted.
                            Similar to Device Magic destinations.
                        </p>

                        <div className="overflow-x-auto mb-4">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Local Database</td>
                                        <td>IndexedDB</td>
                                        <td><span className="badge badge-success">Active</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-ghost">Edit</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email Notification</td>
                                        <td>Email</td>
                                        <td><span className="badge badge-warning">Not Configured</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-ghost">Edit</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>API Endpoint</td>
                                        <td>REST API</td>
                                        <td><span className="badge badge-warning">Not Configured</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-ghost">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <button className="btn btn-primary">Add Destination</button>
                    </div>
                </div>
            )}

            {activeTab === 'sync' && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Sync Configuration</h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Configure how and when form data is synchronized.
                        </p>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Sync Frequency</span>
                            </label>
                            <select className="select select-bordered w-full">
                                <option value="immediately">Immediately When Online</option>
                                <option value="manual">Manual Only</option>
                                <option value="interval">At Regular Intervals</option>
                            </select>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label cursor-pointer">
                                <span className="label-text">Sync on Network Change</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label cursor-pointer">
                                <span className="label-text">Notify on Sync Completion</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Allow Background Sync</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

AdminSettingsPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Admin Settings");

export default AdminSettingsPage; 