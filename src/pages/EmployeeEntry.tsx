import React, { useEffect, useState } from "react";
import { AutosaveIndicator } from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";

interface EmployeeFormState {
    fullName: string;
    walletAddress: string;
    role: string;
    currency: string;
}

const initialFormState: EmployeeFormState = {
    fullName: "",
    walletAddress: "",
    role: "contractor",
    currency: "USDC",
};

export default function EmployeeEntry() {
    const [formData, setFormData] = useState<EmployeeFormState>(initialFormState);

    // Use the autosave hook
    const { saving, lastSaved, loadSavedData } = useAutosave<EmployeeFormState>(
        "employee-entry-draft",
        formData
    );

    // Load saved data on mount
    useEffect(() => {
        const saved = loadSavedData();
        if (saved) {
            setFormData(saved);
        }
    }, [loadSavedData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // clearSavedData();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
                <AutosaveIndicator saving={saving} lastSaved={lastSaved} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="Jane Smith"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Stellar Wallet Address
                    </label>
                    <input
                        type="text"
                        name="walletAddress"
                        value={formData.walletAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="G..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        <option value="contractor">Contractor</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Preferred Currency
                    </label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        <option value="USDC">USDC</option>
                        <option value="XLM">XLM</option>
                        <option value="EURC">EURC</option>
                    </select>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add Employee
                    </button>
                </div>
            </form>
        </div>
    );
}
