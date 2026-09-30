import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function cmdAdminDashboard() {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch the generated timetable
    const fetchTimetable = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/timetable?branch=Electrical&semester=5');
            setTimetable(res.data);
        } catch (err) {
            console.error("Error fetching timetable:", err);
        }
    };

    // Trigger auto-generation
    const handleGenerate = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/timetable/generate', { 
                branch: 'Electrical', 
                semester: 5 
            });
            await fetchTimetable();
        } catch (err) {
            console.error("Error generating timetable:", err);
        }
        setLoading(false);
    };

    useEffect(() => { 
        fetchTimetable(); 
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Government engineering College Madhubani</h1>
                    <p className="text-sm text-gray-500">Branch: Electrical | Semester: 5</p>
                </div>
                <button 
                    onClick={handleGenerate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition font-medium flex items-center gap-2">
                    {loading ? "Generating Magic..." : "⚡ Auto-Generate Timetable"}
                </button>
            </div>

            {/* Timetable Grid View */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Day & Slot</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Faculty Assigned</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {timetable.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No timetable data found. Click <span className="font-semibold text-blue-600">"⚡ Auto-Generate Timetable"</span> to populate entries!
                                </td>
                            </tr>
                        ) : (
                            timetable.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.timeSlotId?.day || 'N/Day'} - Slot {item.timeSlotId?.slotNumber || item.timeSlotId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                        {item.subjectName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.facultyId?.name || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.roomId?.roomNo || 'TBD'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}