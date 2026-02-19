import React, { useEffect, useState } from "react";
import { AutosaveIndicator } from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";

interface PayrollFormState {
    employeeName: string;
    amount: string;
    frequency: "weekly" | "monthly";
    startDate: string;
}

const initialFormState: PayrollFormState = {
    employeeName: "",
    amount: "",
    frequency: "monthly",
    startDate: "",
};

export default function PayrollScheduler() {
    const [formData, setFormData] = useState<PayrollFormState>(initialFormState);

    // Use the autosave hook
    const { saving, lastSaved, loadSavedData } = useAutosave<PayrollFormState>(
        "payroll-scheduler-draft",
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
        // In a real app, you would submit to API and clear saved data
        // clearSavedData();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Payroll Scheduler</h1>
                <AutosaveIndicator saving={saving} lastSaved={lastSaved} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Employee Name
                    </label>
                    <input
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Amount (USD)
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="5000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Frequency
                    </label>
                    <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Schedule Payroll
                    </button>
                </div>
            </form>
        </div>
    );
}
